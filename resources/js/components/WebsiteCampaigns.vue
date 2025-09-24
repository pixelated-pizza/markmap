<template>
  <div class="overflow-auto w-full h-full">
    <div class="flex items-center justify-between align-middle gap-2 bg-gray-600 p-2 mb-2">
      <button type="button" class="focus:outline-none text-white bg-green-700 hover:bg-green-800 
             focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm 
             px-5 py-2.5 mb-2 dark:bg-green-600 dark:hover:bg-green-700 
             dark:focus:ring-green-800" @click="addCampaign">
        Add Campaign
      </button>
      <h2 class="text-md font-bold text-center flex-1 text-gray-50">Website (Mytopia & Edisons) - Spotlight Banners</h2>
    </div>

    <div ref="website_gantt" class="gantt-container h-200 overflow-hidden w-400"></div>
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

const website_gantt = ref([]);


</script>

<style scoped></style>