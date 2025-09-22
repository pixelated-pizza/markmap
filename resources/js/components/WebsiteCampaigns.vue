<template>
  <div class="overflow-auto">
    <div class="flex items-center justify-between align-middle gap-2 bg-white p-2 mb-2">
      <button type="button" class="focus:outline-none text-white bg-green-700 hover:bg-green-800 
             focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm 
             px-5 py-2.5 mb-2 dark:bg-green-600 dark:hover:bg-green-700 
             dark:focus:ring-green-800" @click="addCampaign">
        Add Campaign
      </button>
      <h2 class="text-lg font-bold  text-center flex-1">Website (Mytopia & Edisons) - Landing Page Campaigns</h2>
    </div>

    <div id="website_campaigns" class="gantt-container h-200 overflow-hidden w-400"></div>
  </div>
</template>
<script setup>
import { onMounted } from "vue";
import "dhtmlx-gantt/codebase/dhtmlxgantt.css";
import gantt from "dhtmlx-gantt";

onMounted(() => {
  gantt.plugins({
    quick_info: true
  });

  gantt.init("website_campaigns");

});
</script>

<style scoped></style>