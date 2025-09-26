<template>
  <div class="flex flex-col w-full h-full">
    <!-- Header -->
    <div
      class="flex items-center justify-between gap-2 p-4 mb-4 
             bg-gray-800/80 backdrop-blur-md shadow-xl border border-gray-700 rounded-xl"
    >
      <h2
        class="text-md font-bold text-center flex-1 text-white 
               tracking-wide drop-shadow-lg"
      >
        Website Edisons & Mytopia - On-site Campaigns
      </h2>
    </div>

    <!-- Gantt Container -->
    <div ref="websiteGantt" class="gantt-container flex-1 overflow-hidden"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { getCurrentInstance } from "vue";
import gantt from "dhtmlx-gantt";
import "dhtmlx-gantt/codebase/dhtmlxgantt.css";
import { ganttColors } from "@/colors/dhtmlxgantt_colorselector";

import { renderGantt } from "@/utils/gantt_helper.js";

import {
  fetchWC,
  createWC,
  updateWC,
  deleteWC
} from "@/api/website_campaign_api.js";

const websiteGantt = ref(null);
const toastr = getCurrentInstance().appContext.config.globalProperties.$toastr;
const newTasks = new Set();
let resizeObserver;

// --- Helpers (kept same as campaigns) ---
function parseLocalDate(dateStr) {
  const [y, m, d] = dateStr.split("-");
  return new Date(y, m - 1, d);
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
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")} 23:59:59`;
}
function formatLocalDateTime(date) {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(
    d.getMinutes()
  ).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`;
}

async function initGantt() {
  gantt.setSkin("dark");
  gantt.config.grid_resize = true;
  gantt.config.grid_buttons = true;

  gantt.config.columns = [
    { name: "text", label: "On-site Campaigns", tree: true, width: 350 },
    { name: "add", label: "", width: 44, resize: false }
  ];

  gantt.config.xml_date = "%Y-%m-%d %H:%i";
  gantt.config.drag_move = true;
  gantt.config.drag_resize = true;

  gantt.config.lightbox.sections = [
    { name: "description", map_to: "text", type: "textarea", label: "Name", height: 70 },
    {
      name: "color",
      map_to: "color",
      type: "select",
      label: "Background",
      options: ganttColors
    },
    { name: "time", map_to: "auto", type: "time", label: "Time period" }
  ];

  gantt.clearAll();
  gantt.init(websiteGantt.value);

  await loadWebsiteCampaigns();

  gantt.attachEvent("onAfterTaskUpdate", async (id, task) => {
    if (typeof id === "number") return;
    try {
      await updateWC(id, {
        name: task.text,
        start_date: formatLocalDateTime(task.start_date),
        end_date: formatDateForDB(task.end_date),
        background_color: task.color || null
      });
      toastr.success("Website campaign updated.");
    } catch (err) {
      toastr.error("Failed to update campaign.");
      console.error(err);
    }
  });

  gantt.attachEvent("onAfterTaskDelete", async id => {
    if (typeof id === "number") return;
    try {
      await deleteWC(id);
      toastr.success("Website campaign deleted.");
    } catch (err) {
      toastr.error("Failed to delete campaign.");
      console.error(err);
    }
  });

  gantt.attachEvent("onLightboxSave", async (id, task) => {
    const isNew = newTasks.has(id) || typeof id === "number";
    if (isNew) {
      try {
        const payload = {
          name: task.text || "New Website Campaign",
          start_date: formatLocalDateTime(task.start_date),
          end_date: formatDateForDB(task.end_date),
          background_color: task.color
        };
        const saved = await createWC(payload);
        gantt.changeTaskId(id, saved.id);
        newTasks.delete(id);
        toastr.success("Website campaign created.");
      } catch (err) {
        gantt.deleteTask(id);
        newTasks.delete(id);
        toastr.error("Failed to create campaign.");
        console.error(err);
        return false;
      }
    }
    return true;
  });
}


async function loadWebsiteCampaigns() {
  try {
    const data = await fetchWC();

    const tasks = data.map(c => ({
      id: c.id,
      text: c.name,
      start_date: new Date(c.start_date),
      end_date: parseEndDate(c.end_date),
      color: c.background_color
    }));

    gantt.clearAll();
    gantt.parse({ data: tasks });
  } catch (err) {
    toastr.error("Failed to load website campaigns.");
    console.error(err);
  }
}

onMounted(() => {
  initGantt();
  resizeObserver = new ResizeObserver(() => gantt.setSizes());
  resizeObserver.observe(websiteGantt.value);
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

<style scoped>
.gantt-container {
  width: 100%;
  height: 100%;
}
</style>
