<template>
  <div class="overflow-auto w-full h-full mt-5">
    <div class="flex items-center justify-between align-middle gap-2 bg-gray-600 p-2 mb-2">
      <button type="button" class="focus:outline-none text-white bg-green-700 hover:bg-green-800 
             focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm 
             px-5 py-2.5 mb-2 dark:bg-green-600 dark:hover:bg-green-700 
             dark:focus:ring-green-800" @click="addCampaign">
        Add Campaign
      </button>
      <h2 class="text-md font-bold text-center flex-1 text-gray-50">Website (Mytopia & Edisons) - On-Site Campaigns</h2>
    </div>

    <div ref="wcContainer" id="website_campaigns" class="gantt-container h-200 overflow-hidden w-400"></div>
  </div>
</template>
<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { getCurrentInstance } from "vue";
import gantt from "dhtmlx-gantt";
import "dhtmlx-gantt/codebase/dhtmlxgantt.css";
import { ganttColors } from "@/colors/dhtmlxgantt_colorselector";
import { fetchWC, createWC, updateWC, deleteWC } from '@/api/website_campaign_api.js';
import { fetchChannels } from "@/api/campaign_service";

const toastr = getCurrentInstance().appContext.config.globalProperties.$toastr;

const wcContainer = ref(null);
const newTasks = new Set();
const channels = ref([]);

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
  gantt.config.grid_resize = true;

  gantt.config.columns = [
    {
      name: "channel",
      label: "Section",
      width: 170,
      template: function (task) {
        const channel = channels.value.find(c => c.channel_id === task.channel_id);
        return channel ? channel.name : "";
      }
    },
    {
      name: "text",
      label: "On-site Campaign Name",
      width: 300,
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

  gantt.templates.task_class = function (start, end, task) {
    if (task.color) {
      return "custom-task-" + task.color.replace("#", "");
    }
    return "";
  };

  gantt.config.lightbox.sections = [
    { name: "description", height: 70, map_to: "text", type: "textarea", focus: true, label: "Campaign Name / Promo" },
    {
      name: "Section",
      type: "select",
      options: channels.value.map(c => ({ key: c.channel_id, label: c.name })),
      map_to: "section_id",
      label: "Section"
    },
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

  gantt.init(wcContainer.value);
  loadCampaigns();

  gantt.attachEvent("onAfterTaskUpdate", async (id, task) => {
    if (typeof id === "number") return;

    try {
      await updateWC(id, {
        name: task.text,
        start_date: formatLocalDateTime(task.start_date),
        end_date: formatDateForDB(task.end_date),
        channel_id: task.channel_id,
        background_color: task.color || null,
      });
      toastr.success("Campaign updated successfully.");
      loadCampaigns();
    } catch (err) {
      console.error("Error updating campaign:", err);
      toastr.error("Failed to update campaign.");
    }
  });

  gantt.attachEvent("onAfterTaskDelete", async id => {
    if (typeof id === "number") return;
    try {
      await deleteWC(id);
      toastr.success("Campaign deleted successfully.");
      loadCampaigns();
    } catch (err) {
      console.error("Error deleting campaign:", err);
      toastr.error("Failed to delete campaign.");
    }
  });

  gantt.attachEvent("onLightboxSave", async (id, task) => {
    if (newTasks.has(id)) {
      try {
        const payload = {
          name: task.text || "New Campaign",
          start_date: formatLocalDateTime(task.start_date),
          end_date: formatDateForDB(task.end_date),
          channel_id: task.channel_id,
          background_color: task.color,
        };
        const saved = await createWC(payload);
        gantt.changeTaskId(id, saved.campaign_id);
        newTasks.delete(id);

        toastr.success("Campaign created successfully.");
        loadCampaigns();
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
    const campaigns = await fetchWC();
    const ganttTasks = {
      data: campaigns.map(c => ({
        id: c.campaign_id,
        text: c.name,
        start_date: new Date(c.start_date),
        end_date: parseEndDate(c.end_date),
        channel_id: c.channel_id,
        color: c.background_color,
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

  const defaultEnd = new Date(now.getTime() + 13 * 24 * 60 * 60 * 1000);
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
  } catch { }
});

</script>

<style scoped></style>