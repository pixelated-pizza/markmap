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
      Add Campaign
    </button>

    <div class="gantt-wrapper">
      <div ref="ganttContainer" class="gantt-container"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import gantt from "dhtmlx-gantt";
import "dhtmlx-gantt/codebase/dhtmlxgantt.css";

const ganttContainer = ref(null);

function initGantt() {
  gantt.config.columns = [
    { name: "text", label: "Sales Campaign name", tree: true, width: 250 },
    {
      name: "start_date",
      label: "Start date",
      align: "center",
      template(task) {
        return task.start_date ? gantt.templates.date_grid(task.start_date) : "";
      }
    },
    {
      name: "duration",
      label: "Duration",
      align: "center",
      template(task) {
        if (task.start_date && task.end_date) {
          return Math.round(gantt.calculateDuration(task.start_date, task.end_date));
        }
        return task.duration || "";
      }
    },
    { name: "add", label: "", width: 44 }
  ];

  gantt.config.xml_date = "%Y-%m-%d %H:%i";
  gantt.config.drag_move = true;
  gantt.config.drag_resize = true;
  gantt.config.drag_links = true;

  const fmt = gantt.date.date_to_str("%Y-%m-%d %H:%i");
  const strToDate = gantt.date.str_to_date(gantt.config.xml_date);

  gantt.templates.tooltip_text = function (start, end, task) {
    return `
      Task: <b>${task.text}</b><br/>
      Start: <b>${fmt(start)}</b><br/>
      End: <b>${fmt(end)}</b><br/>
      Progress: <b>${Math.round((task.progress || 0) * 100)}%</b>
    `;
  };

  gantt.config.scales = [
  { unit: "day", step: 1, format: "%D, %d %M" }, 
];

  gantt.init(ganttContainer.value);

gantt.attachEvent("onAfterTaskAdd", function(id, task) {
  gantt.render();
  gantt.showDate(task.start_date); 
  gantt.showDate(task.end_date);   
});

gantt.attachEvent("onAfterTaskUpdate", function(id, task) {
  gantt.render();
  gantt.showDate(task.end_date);
});

  gantt.parse({ data: [] });

  gantt.attachEvent("onLightboxSave", function (id, task, is_new) {
    if (typeof task.start_date === "string") {
      task.start_date = strToDate(task.start_date);
    }
    task.end_date = gantt.calculateEndDate(task.start_date, task.duration);
    task.duration = gantt.calculateDuration(task.start_date, task.end_date);

    gantt.updateTask(id);
    gantt.refreshTask(id);
    return true; 
  });

  gantt.attachEvent("onTaskEndDateChange", function (id, task) {
    task.duration = gantt.calculateDuration(task.start_date, task.end_date);
    gantt.updateTask(id);
    gantt.refreshTask(id);
    return true;
  });

  gantt.attachEvent("onTaskChanged", function (id, task) {
    if (task.start_date && task.end_date) {
      task.duration = gantt.calculateDuration(task.start_date, task.end_date);
    }
    gantt.updateTask(id);
    gantt.refreshTask(id);
    return true;
  });

  gantt.attachEvent("onTaskClick", function (id) {
    console.log("Gantt task:", gantt.getTask(id));
    return true;
  });
}

function handleResize() {
  if (gantt && gantt.setSizes) gantt.setSizes();
  else gantt.render();
}

function addCampaign() {
  const id = gantt.uid();
  gantt.addTask({
    id,
    text: "New Campaign",
    start_date: new Date(),
    duration: 5,
    progress: 0
  });

  gantt.showLightbox(id);
}

onMounted(() => {
  initGantt();
  window.addEventListener("resize", handleResize);
});

onBeforeUnmount(() => {
  try {
    window.removeEventListener("resize", handleResize);
    gantt.clearAll();
  } catch (e) {
    // ignore
  }
});
</script>

<style scoped>
.gantt-wrapper {
  width: 80vw;
  height: 40vw;
  display: flex;
  flex-direction: column;
}

.gantt-container {
  flex: 1 1 auto;
  min-height: 400px;
  width: 100%;
  height: 100%;
  overflow: auto;
}
</style>
