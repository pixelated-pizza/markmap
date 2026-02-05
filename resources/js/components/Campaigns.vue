<template>
  <div class="flex flex-col bg-gray-100 dark:bg-gray-900 h-auto max-h-[88vh] overflow-auto">
    <div class="bg-white dark:bg-gray-800 mb-5 border-b border-gray-200 dark:border-gray-700">
      <h4 class="text-md font-bold text-gray-900 dark:text-white text-center tracking-wide drop-shadow-sm py-3">
        Website Sales, Promotions, Marketplaces Campaigns
      </h4>

      <div class="flex flex-wrap items-center gap-2 ml-5 pb-3">
        <Select v-model="selectedChannel" :options="channels" optionLabel="name" optionValue="channel_id"
          placeholder="All Channels" class="w-48" showClear />

        <InputText v-model="searchTerm" placeholder="Search Campaigns..." class="w-60" />

        <DatePicker v-model="dateRange" selectionMode="range" dateFormat="yy-mm-dd" placeholder="Filter by Date Range"
          class="w-64" showIcon />

        <Button label="Reset" icon="pi pi-refresh" class="p-button-secondary" @click="resetFilters" />
      </div>
    </div>

    <div
      class="gantt-wrapper relative w-full max-h-[70vh] sm:max-h-[75vh] md:max-h-[80vh] lg:max-h-[85vh] overflow-auto touch-pan-y">

      <div ref="ganttContainer" class="gantt-container w-full min-h-[400px] sm:min-h-[500px]
         bg-white dark:bg-gray-900
">
      </div>


      <div v-if="loading"
        class="absolute inset-0 bg-white/80 dark:bg-gray-900/80 flex flex-col gap-4 justify-center items-center z-10">

        <p class="text-gray-600 dark:text-gray-300 text-lg">
          Loading calendar...
        </p>

        <Skeleton height="2rem" width="70%" />
        <Skeleton height="2rem" width="50%" />
        <Skeleton height="1rem" width="90%" />
        <Skeleton height="1rem" width="85%" />
        <Skeleton height="1rem" width="95%" />
      </div>

    </div>

  </div>
</template>


<script setup>
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from "vue";
import { getCurrentInstance } from "vue";
import gantt from "dhtmlx-gantt";
import "dhtmlx-gantt/codebase/dhtmlxgantt.css";
import { ganttColors } from "@/js/colors/dhtmlxgantt_colorselector";

import Select from "primevue/select";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import DatePicker from "primevue/datepicker";
import Skeleton from 'primevue/skeleton';

const toastr = getCurrentInstance().appContext.config.globalProperties.$toastr;

const loading = ref(true);

import {
  fetchCampaigns,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  fetchChannels,
} from "@/js/api/campaign_service";

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
  gantt.config.grid_resize = true;
  gantt.config.grid_buttons = true;

  gantt.config.columns = [
    {
      name: "text",
      label: "Campaigns",
      tree: true,
      width: window.innerWidth < 640 ? 180 : 400, // small screens
      template: task => task.type !== "project" ? `<span style="margin-left:8px">${task.text}</span>` : `<b>${task.text}</b>`
    },
    {
      name: "add",
      label: "",
      width: 44,
      resize: false,
      template: task => task.type === "project" ? "<div class='add_child'>+</div>" : ""
    }
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
  applyGanttTheme();
   
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
    applyGanttTheme(); 
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

  // ✅ Only clear once, then parse
  gantt.clearAll();
  gantt.parse({ data });
  gantt.render();
  applyGanttTheme(); 

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

function applyGanttTheme() {
  const isDark =
    document.documentElement.classList.contains("app-dark");

  if (isDark) {
    gantt.setSkin("dark");
  } else {
    gantt.setSkin("meadow");
  }

  requestAnimationFrame(() => {
    gantt.render();
    gantt.setSizes();
  });
}


function watchDarkMode() {
  const observer = new MutationObserver(() => {
    applyGanttTheme();
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });

  return observer;
}

let darkObserver;

onMounted(async () => {
  try {
    channels.value = await fetchChannels();

    darkObserver = watchDarkMode();

    // wait DOM to be painted
    await nextTick();

    if (!ganttContainer.value) {
      console.error("Gantt container not found");
      loading.value = false;
      return;
    }

    await initGantt();
    await loadCampaigns();

    loading.value = false;

    resizeObserver = new ResizeObserver(() => gantt.setSizes());
    resizeObserver.observe(ganttContainer.value);
  } catch (err) {
    console.error("Error initializing gantt:", err);
    loading.value = false;
  }
});

onBeforeUnmount(() => {
  try {
    if (resizeObserver) resizeObserver.disconnect();
    if (darkObserver) darkObserver.disconnect();
    gantt.clearAll();
    gantt.detachAllEvents();
  } catch (e) {
    console.warn("Failed to cleanup gantt", e);
  }
});
</script>

<style>
/* ---------- BASE CONTAINER ---------- */
.gantt-container {
  width: 100%;
  min-height: 500px;
}

/* ========== FORCE DARK MODE (STRONGER) ========== */
.dark .gantt_container,
.dark .gantt_layout_root,
.dark .gantt_grid,
.dark .gantt_grid_scale,
.dark .gantt_grid_data,
.dark .gantt_data_area,
.dark .gantt_task_scale,
.dark .gantt_task_bg,
.dark .gantt_task,
.dark .gantt_scale_line,
.dark .gantt_task_cell,
.dark .gantt_task_row,
.dark .gantt_task_bg,
.dark .gantt_task_content {
  background: #111827 !important; /* gray-900 */
  border-color: #374151 !important; /* gray-700 */
}

/* Grid headers */
.dark .gantt_grid_head_cell,
.dark .gantt_grid_scale {
  background: #1f2937 !important; /* gray-800 */
  color: #e5e7eb !important;
}

/* Text */
.dark .gantt_tree_content,
.dark .gantt_grid_head_text,
.dark .gantt_task_content,
.dark .gantt_scale_cell {
  color: #e5e7eb !important;
}

/* Timeline background stripes */
.dark .gantt_task_bg {
  background: #111827 !important;
}

/* Today line */
.dark .gantt_today_line {
  background: #60a5fa !important; /* blue-400 */
}

/* Lightbox (popup) */
.dark .gantt_lightbox {
  background: #111827 !important;
  color: #e5e7eb !important;
}


</style>
