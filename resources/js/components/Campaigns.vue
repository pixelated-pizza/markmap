<template>
  <div class="flex flex-col w-full h-full bg-gray-900 p-10">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 mb-4 
             bg-gray-800/80 backdrop-blur-md shadow-xl border border-gray-700 rounded-xl">
      <h2 class="text-md font-bold text-white tracking-wide drop-shadow-lg">
        Website Sales, Promotions, Marketplaces Campaigns
      </h2>

      <div class="flex flex-wrap items-center gap-3">
        <Select v-model="selectedChannel" :options="channels" optionLabel="name" optionValue="channel_id"
          placeholder="All Channels" class="w-48" showClear />

        <InputText v-model="searchTerm" placeholder="Search Campaigns..." class="w-60" />

        <Calendar v-model="dateRange" selectionMode="range" dateFormat="yy-mm-dd" placeholder="Filter by Date Range"
          class="w-64" showIcon />

        <Button label="Reset" icon="pi pi-refresh" class="p-button-secondary" @click="resetFilters" />
      </div>
    </div>

    <template v-if="loading">
      <div class="flex flex-col gap-4 w-full h-full">
        <p class="text-gray-400 text-lg">Loading calendar...</p>
        <Skeleton height="2rem" width="70%" />
        <Skeleton height="2rem" width="50%" />
        <Skeleton height="1rem" width="90%" />
        <Skeleton height="1rem" width="85%" />
        <Skeleton height="1rem" width="95%" />
        <div class="flex-1 mt-2">
          <Skeleton height="100%" borderRadius="8px" />
        </div>
      </div>
    </template>

    <div v-else ref="ganttContainer" class="gantt-container flex-1 overflow-hidden"></div>
  </div>
</template>


<script setup>
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from "vue";
import { getCurrentInstance } from "vue";
import gantt from "dhtmlx-gantt";
import "dhtmlx-gantt/codebase/dhtmlxgantt.css";
import { ganttColors } from "@/colors/dhtmlxgantt_colorselector";

import Select from "primevue/select";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Calendar from "primevue/calendar";
import Skeleton from 'primevue/skeleton';

const toastr = getCurrentInstance().appContext.config.globalProperties.$toastr;

const loading = ref(true);

import {
  fetchCampaigns,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  fetchChannels,
} from "@/api/campaign_service";

const ganttContainer = ref(null);
const hiddenCampaigns = ref(new Set());
const selectedChannel = ref(null);
const searchTerm = ref("");
let allCampaigns = [];

const dateRange = ref(null);

const newTasks = new Set();
const channels = ref([]);
let resizeObserver;

function parseLocalDate(dateStr) {
  const [year, month, day] = dateStr.split("-");
  return new Date(year, month - 1, day);
}

function parseEndDate(dateStr) {
  const d = parseLocalDate(dateStr);
  d.setDate(d.getDate() + 1);
  d.setHours(0, 0, 0, 0);
  return d;
}


function formatDateForDB(date) {
  const d = new Date(date.getTime() - 1000);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day} 23:59:59`;
}

function formatLocalDateTime(date) {
  const d = new Date(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const h = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  const sec = String(d.getSeconds()).padStart(2, "0");
  return `${y}-${m}-${day} ${h}:${min}:${sec}`;
}


async function initGantt() {
  gantt.setSkin("dark");

  gantt.config.grid_resize = true;
  gantt.config.grid_buttons = true;

  gantt.config.columns = [
    {
      name: "text",
      label: "Sales Channels / Campaigns",
      tree: true,
      width: 400,
      template: function (task) {
        if (task.type !== "project") {
          return `
          <span style="margin-left: 8px;">${task.text}</span>
        `;
        }
        return `<b>${task.text}</b>`;
      },
    },
    {
      name: "add",
      label: "",
      width: 44,
      resize: false,
      template: function (task) {
        return task.type === "project"
          ? "<div class='add_child'>+</div>"
          : "";
      },
    },
  ];


  gantt.config.xml_date = "%Y-%m-%d %H:%i";
  gantt.config.drag_move = true;
  gantt.config.drag_resize = true;
  gantt.config.drag_links = true;

  const fmt = gantt.date.date_to_str("%Y-%m-%d %H:%i");

  gantt.templates.tooltip_text = (start, end, task) => `
    Task: <b>${task.text}</b><br/>
    Start: <b>${fmt(start)}</b><br/>
    End: <b>${fmt(end)}</b><br/>
    Progress: <b>${Math.round((task.progress || 0) * 100)}%</b>
  `;

  gantt.config.scales = [{ step: 1, format: "%d %M" }];

  gantt.config.lightbox.sections = [
    { name: "description", height: 70, map_to: "text", type: "textarea", focus: true, label: "Campaign Name / Promo" },
    {
      name: "color", height: 30, map_to: "color", type: "select", label: "Background Color",
      options: ganttColors
    },
    { name: "time", type: "time", map_to: "auto", label: "Time period (Start - End)" },

  ];

  gantt.eachTask(task => {
    if (!task.channel_id && channels.value.length) {
      task.channel_id = channels.value[0].channel_id;
    }
  });

  gantt.init(ganttContainer.value);
  ganttContainer.value.addEventListener("change", (e) => {
  if (e.target.classList.contains("hide-checkbox")) {
    const taskId = e.target.dataset.taskId;
    const checked = e.target.checked;

    if (checked) {
      hiddenCampaigns.value.add(taskId);
    } else {
      hiddenCampaigns.value.delete(taskId);
    }

    applyHiddenCampaigns();
  }
});
  loadCampaigns();

  gantt.attachEvent("onAfterTaskUpdate", async (id, task) => {
    if (typeof id === "number") return;

    task.parent = `channel_${task.channel_id}`;

    try {
      await updateCampaign(id, {
        name: task.text,
        start_date: formatLocalDateTime(task.start_date),
        end_date: formatDateForDB(task.end_date),
        channel_id: task.channel_id,
        background_color: task.color || null,
      });
      toastr.success("Campaign updated successfully.");
    } catch (err) {
      console.error("Error updating campaign:", err);
      toastr.error("Failed to update campaign.");
    }
  });

  gantt.attachEvent("onBeforeTaskDelete", function (id, task) {
    if (task.type === "project" && !task.$virtual) {
      toastr.warning("Channels cannot be deleted.");
      return false;
    }
    return true;
  });


  gantt.attachEvent("onAfterTaskDelete", async id => {
    if (typeof id === "number") return;
    try {
      await deleteCampaign(id);
      toastr.success("Campaign deleted successfully.");
      loadCampaigns();
    } catch (err) {
      console.error("Error deleting campaign:", err);
      toastr.error("Failed to delete campaign.");
    }
  });

  gantt.attachEvent("onTaskCreated", function (task) {
    const parent = gantt.getTask(task.parent);

    if (parent.channel_id) {
      task.channel_id = parent.channel_id;
      task.type = "task";
    }

    task.text = "New Campaign";
    task.start_date = new Date();
    task.end_date = new Date(task.start_date.getTime() + 13 * 24 * 60 * 60 * 1000);

    return true;
  });


  gantt.attachEvent("onLightboxSave", async (id, task) => {
    if (!task.channel_id && task.parent?.startsWith("channel_")) {
      task.channel_id = task.parent.replace("channel_", "");
    }
    task.parent = `channel_${task.channel_id}`;

    const isNew = newTasks.has(id) || typeof id === "number";

    if (isNew) {
      try {
        const payload = {
          name: task.text || "New Campaign / Promo",
          start_date: formatLocalDateTime(task.start_date),
          end_date: formatDateForDB(task.end_date),
          channel_id: task.channel_id,
          background_color: task.color,
        };
        const saved = await createCampaign(payload);

        gantt.changeTaskId(id, saved.campaign_id);
        newTasks.delete(id);

        toastr.success("Campaign created successfully.");
      } catch (err) {
        console.error("Error saving campaign:", err);
        gantt.deleteTask(id);
        newTasks.delete(id);
        toastr.error("Failed to create campaign.");
        return false;
      }
    }
    return true;
  });
}

function autoAdjustTimeline(filteredTasks = []) {
  if (!filteredTasks.length) return;

  let minDate = null;
  let maxDate = null;

  filteredTasks.forEach(task => {
    if (!task.start_date || !task.end_date) return;
    const start = new Date(task.start_date);
    const end = new Date(task.end_date);

    if (!minDate || start < minDate) minDate = start;
    if (!maxDate || end > maxDate) maxDate = end;
  });

  if (minDate && maxDate) {
    const padding = 1;
    minDate = new Date(minDate.getTime() - padding * 86400000);
    maxDate = new Date(maxDate.getTime() + padding * 86400000);

    gantt.config.start_date = minDate;
    gantt.config.end_date = maxDate;

    gantt.render();
    gantt.renderCalendar();
    gantt.refreshData();
  }
}



async function loadCampaigns() {
  try {
    const campaigns = await fetchCampaigns();
    allCampaigns = campaigns;
    renderFilteredCampaigns();
  } catch (err) {
    console.error("Failed to load campaigns:", err);
  }
}

function renderFilteredCampaigns() {
  const channelMap = {};
  const data = [];

  const preferredOrder = ["Edisons", "Mytopia"];
  const sortedChannels = [...channels.value].sort((a, b) => {
    const ai = preferredOrder.indexOf(a.name);
    const bi = preferredOrder.indexOf(b.name);
    if (ai !== -1 && bi !== -1) return ai - bi;
    if (ai !== -1) return -1;
    if (bi !== -1) return 1;
    return a.name.localeCompare(b.name);
  });

  sortedChannels.forEach(c => {
    const parentId = `channel_${c.channel_id}`;
    channelMap[c.channel_id] = parentId;

    data.push({
      id: parentId,
      text: c.name,
      channel_id: c.channel_id,
      type: "project",
      open: true,
      hide_bar: true,
    });
  });

  const [startFilter, endFilter] = dateRange.value || [];

  const filtered = allCampaigns.filter(c => {
    const matchChannel = selectedChannel.value ? c.channel_id === selectedChannel.value : true;
    const matchSearch = searchTerm.value
      ? c.name.toLowerCase().includes(searchTerm.value.toLowerCase())
      : true;

    const campaignStart = new Date(c.start_date);
    const campaignEnd = new Date(c.end_date);

    let matchDate = true;
    if (startFilter && endFilter) {
      matchDate = campaignEnd >= startFilter && campaignStart <= endFilter;
    }

    return matchChannel && matchSearch && matchDate;
  });

  filtered.forEach(c => {
    data.push({
      id: c.campaign_id,
      text: c.name,
      start_date: new Date(c.start_date),
      end_date: parseEndDate(c.end_date),
      channel_id: c.channel_id,
      color: c.background_color,
      parent: channelMap[c.channel_id],
    });
  });

  gantt.clearAll();
  gantt.parse({ data });
  gantt.clearAll();
  gantt.parse({ data });

  applyHiddenCampaigns();


  setTimeout(() => autoAdjustTimeline(filtered), 50);
}

function applyHiddenCampaigns() {
  gantt.eachTask(task => {
    const row = gantt.getTaskRowNode(task.id);
    if (!row) return;

    if (hiddenCampaigns.value.has(task.id)) {
      row.style.display = "none";
      const bar = gantt.getTaskNode(task.id);
      if (bar) bar.style.display = "none";
    } else {
      row.style.display = "";
      const bar = gantt.getTaskNode(task.id);
      if (bar) bar.style.display = "";
    }
  });
}

watch([searchTerm, selectedChannel, dateRange], () => {
  renderFilteredCampaigns();
});

function resetFilters() {
  searchTerm.value = "";
  selectedChannel.value = null;
  dateRange.value = null;
  renderFilteredCampaigns();
}


onMounted(async () => {
  channels.value = await fetchChannels();
  await loadCampaigns();
  loading.value = false;
});

watch(loading, async (val) => {
  if (!val) {
    await nextTick();
    await initGantt();
    resizeObserver = new ResizeObserver(() => {
      gantt.setSizes();
    });
    resizeObserver.observe(ganttContainer.value);
  }
});


onBeforeUnmount(() => {
  try {
    if (resizeObserver) resizeObserver.disconnect();
    gantt.clearAll();
    gantt.detachAllEvents();
  } catch (e) {
    console.warn("Failed to cleanup gantt", e);
  }
});
</script>

<style scoped></style>
