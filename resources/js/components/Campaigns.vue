<template>
  <div>
    <button
      type="button"
      class="focus:outline-none text-white bg-green-700 hover:bg-green-800 
             focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm 
             px-5 py-2.5 mb-2 dark:bg-green-600 dark:hover:bg-green-700 
             dark:focus:ring-green-800"
      @click="addCampaign"
    >
      Add Campaign / Promo
    </button>

    <div ref="ganttContainer" class="gantt-container w-400 h-200"></div>
  </div>
</template>

<script setup>
import Swal from "sweetalert2";
import { ref, onMounted, onBeforeUnmount } from "vue";
import { getCurrentInstance } from "vue";
import gantt from "dhtmlx-gantt";
import "dhtmlx-gantt/codebase/dhtmlxgantt.css";

const toastr = getCurrentInstance().appContext.config.globalProperties.$toastr;

import {
  fetchCampaigns,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  fetchChannels,
} from "../services/campaign_service";

const ganttContainer = ref(null);
const newTasks = new Set();
const channels = ref([]);

function parseLocalDate(dateStr) {
  const [year, month, day] = dateStr.split("-");
  return new Date(year, month - 1, day); 
}

function parseEndDate(dateStr) {
  const d = parseLocalDate(dateStr);
  d.setDate(d.getDate() + 1);
  d.setHours(0,0,0,0);
  return d;
}

function setEndOfDay(date) {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
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

async function loadChannels() {
  channels.value = await fetchChannels(); 
}

async function initGantt() {
  gantt.config.grid_resize = true;

  gantt.config.columns = [
    {
      name: "channel",
      label: "Category/Sales Channel",
      width: 170,
      template: function (task) {
        const channel = channels.value.find(c => c.channel_id === task.channel_id);
        return channel ? channel.name : "";
      }
    },
    {
      name: "text",
      label: "Campaign Name/Discount Name",
      width: 250,
      tree: false,
      resize: true
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
      name: "Category / Sales Channel",
      type: "select",
      options: channels.value.map(c => ({ key: c.channel_id, label: c.name })),
      map_to: "channel_id",
      label: "Channel"
    },
    { name: "time", type: "time", map_to: "auto", label: "Time period (Start - End)" },
    
  ];

  gantt.eachTask(task => {
    if (!task.channel_id && channels.value.length) {
      task.channel_id = channels.value[0].channel_id;
    }
  });

  gantt.init(ganttContainer.value);
  gantt.attachEvent("onAfterTaskAdd", autoAdjustTimeline);
  gantt.attachEvent("onAfterTaskUpdate", autoAdjustTimeline);
  gantt.attachEvent("onAfterTaskDelete", autoAdjustTimeline);
  loadCampaigns();

  gantt.attachEvent("onAfterTaskUpdate", async (id, task) => {
  if (typeof id === "number") return;

  try {
    await updateCampaign(id, {
      name: task.text,
      start_date: formatLocalDateTime(task.start_date),
      end_date: formatDateForDB(task.end_date),  
      channel_id: task.channel_id,
    });
    toastr.success("Campaign updated successfully.");
  } catch (err) {
    console.error("Error updating campaign:", err);
    toastr.error("Failed to update campaign.");
  }
});

  gantt.attachEvent("onAfterTaskDelete", async id => {
    if (typeof id === "number") return;
    try {
      await deleteCampaign(id);
      toastr.success("Campaign deleted successfully.");
    } catch (err) {
      console.error("Error deleting campaign:", err);
      toastr.error("Failed to delete campaign.");
    }
  });

  gantt.attachEvent("onLightboxSave", async (id, task) => {
    if (newTasks.has(id)) {
      try {
        const payload = {
          name: task.text || "New Campaign / Promo",
          start_date: formatLocalDateTime(task.start_date),
          end_date: formatDateForDB(task.end_date), 
          channel_id: task.channel_id,
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
    minDate = new Date(minDate.getTime() - padding * 24*60*60*1000);
    maxDate = new Date(maxDate.getTime() + padding * 24*60*60*1000);

    gantt.config.start_date = minDate;
    gantt.config.end_date = maxDate;
    gantt.render();
  }
}

async function loadCampaigns() {
  try {
    const campaigns = await fetchCampaigns();
    const ganttTasks = {
      data: campaigns.map(c => ({
        id: c.campaign_id,
        text: c.name,
        start_date: new Date(c.start_date), 
        end_date: parseEndDate(c.end_date),
        channel_id: c.channel_id,
      })),
    };
    gantt.parse(ganttTasks);
    autoAdjustTimeline();
  } catch (err) {
    console.error("Failed to load campaigns:", err);
  }
}

async function addCampaign() {
  const tempId = gantt.uid();
  const now = new Date();

  const defaultEnd = new Date(now.getTime() + 13*24*60*60*1000);
  const endDate = normalizeEndDate(defaultEnd);

  const task = {
    id: tempId,
    text: "New Campaign",
    start_date: formatLocalDateTime(now),
    end_date: formatLocalDateTime(endDate),
    channel_id: channels.value.length ? channels.value[0].channel_id : null,
  };

  gantt.addTask(task);
  newTasks.add(tempId);
  gantt.showLightbox(tempId);
}

onMounted(async () => {
  channels.value = await fetchChannels(); 
  await initGantt(); 
  window.addEventListener("resize", () => gantt.setSizes());
});


onBeforeUnmount(() => {
  try {
    window.removeEventListener("resize", () => gantt.setSizes());
    gantt.clearAll();
  } catch {}
});
</script>
