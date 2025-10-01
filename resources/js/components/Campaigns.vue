<template>
  <div class="flex flex-col w-full h-full bg-gray-900 p-10">
    <div class="flex items-center justify-between gap-2 p-4 mb-4 
            bg-gray-800/80 backdrop-blur-md shadow-xl border border-gray-700 rounded-xl">
      <h2 class="text-md font-bold  flex-1 text-white 
             tracking-wide drop-shadow-lg">
        Website Sales, Promotions, Marketplaces Campaigns
      </h2>
    </div>


    <div ref="ganttContainer" class="gantt-container flex-1 overflow-hidden"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { getCurrentInstance } from "vue";
import gantt from "dhtmlx-gantt";
import "dhtmlx-gantt/codebase/dhtmlxgantt.css";
import { ganttColors } from "@/colors/dhtmlxgantt_colorselector";

const toastr = getCurrentInstance().appContext.config.globalProperties.$toastr;

import {
  fetchCampaigns,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  fetchChannels,
} from "@/api/campaign_service";

const ganttContainer = ref(null);
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

function normalizeEndDate(date) {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
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
      label: "Sales Channels",
      tree: true,
      width: 350,
      template: function (task) {
        if (!task.parent || task.parent === 0) {
          const channel = channels.value.find(c => c.channel_id === task.channel_id);
          return channel ? channel.name : "Unknown Channel";
        }
        return task.text;
      }
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
      }

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

function autoAdjustTimeline() {
  const tasks = gantt.getTaskByTime();

  if (!tasks.length) return;

  let minDate = null;
  let maxDate = null;

  gantt.eachTask(task => {
    if (!minDate || task.start_date < minDate) minDate = task.start_date;
    if (!maxDate || task.end_date > maxDate) maxDate = task.end_date;
  });

  if (minDate && maxDate) {
    const padding = 1;
    minDate = new Date(minDate.getTime() - padding * 24 * 60 * 60 * 1000);
    maxDate = new Date(maxDate.getTime() + padding * 24 * 60 * 60 * 1000);

    gantt.config.start_date = minDate;
    gantt.config.end_date = maxDate;
    gantt.render();
  }
}

async function loadCampaigns() {
  try {
    const campaigns = await fetchCampaigns();

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

    campaigns.forEach(c => {
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
    autoAdjustTimeline();
  } catch (err) {
    console.error("Failed to load campaigns:", err);
  }
}



async function addCampaign() {
  const tempId = gantt.uid();
  const now = new Date();
  const defaultEnd = new Date(now.getTime() + 13 * 24 * 60 * 60 * 1000);
  const endDate = normalizeEndDate(defaultEnd);

  const channelId = channels.value.length ? channels.value[0].channel_id : null;

  const task = {
    id: tempId,
    text: "New Campaign",
    start_date: formatLocalDateTime(now),
    end_date: formatLocalDateTime(endDate),
    channel_id: channelId,
    parent: `channel_${channelId}`,
    type: "task",
  };

  gantt.addTask(task);
  newTasks.add(tempId);
  gantt.showLightbox(tempId);
}

onMounted(async () => {
  channels.value = await fetchChannels();
  await initGantt();
  resizeObserver = new ResizeObserver(() => {
    gantt.setSizes();
  });
  resizeObserver.observe(ganttContainer.value);
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
