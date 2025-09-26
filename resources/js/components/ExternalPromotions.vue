<template>
  <div class="items-center justify-between gap-2 p-4 mt-5
            bg-gray-800/80 backdrop-blur-md shadow-xl border border-gray-700 rounded-xl">
    <h2 class="text-md font-bold flex-1 text-white 
             tracking-wide drop-shadow-lg">
      External Promotions
    </h2>
  </div>
  <div class="w-full mt-3 bg-gray-900 rounded-lg p-3">
    <FullCalendar ref="calendarRef" :options="calendarOptions" class="w-full" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import FullCalendar from "@fullcalendar/vue3"
import interactionPlugin from "@fullcalendar/interaction"
import dayGridPlugin from "@fullcalendar/daygrid"
import resourceTimelinePlugin from "@fullcalendar/resource-timeline"
import { fetchWC } from "@/api/website_campaign_api.js";
import { fetchChannels } from "@/api/campaign_service";

const calendarRef = ref(null);
const channels = ref([]);

const allowedChannels = [
  "Mytopia",
  "Edisons",
  "Hot Deals",
  "Additional Campaigns",
  "Adhoc Promos/Coupons",
];

const calendarOptions = ref({
  schedulerLicenseKey: "GPL-My-Project-Is-Open-Source",
  plugins: [resourceTimelinePlugin, dayGridPlugin, interactionPlugin],
  initialView: "resourceTimelineMonth",
  headerToolbar: {
    left: "prev,next today",
    center: "title",
    right: "resourceTimelineMonth",
  },
  resourceAreaHeaderContent: "Sales Channel",
  resources: [],
  resourceOrder: null,
  events: [],
  editable: false,
  selectable: false,
  aspectRatio: 2,
  height: "auto",
});

function parseEndDate(dateStr) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + 1);
  d.setHours(0, 0, 0, 0);
  return d.toISOString().split("T")[0];
}

async function loadCampaigns() {
  try {
    const allChannels = await fetchChannels();
    channels.value = allChannels.filter(
      (c) => !allowedChannels.includes(c.name)
    );

    const priorityOrder = ["eBay", "Amazon", "MyDeal/WMP"];

    channels.value.sort((a, b) => {
      const aPriority = priorityOrder.indexOf(a.name);
      const bPriority = priorityOrder.indexOf(b.name);

      if (aPriority !== -1 && bPriority !== -1) {
        return aPriority - bPriority;
      }
      if (aPriority !== -1) return -1;
      if (bPriority !== -1) return 1;
      return a.name.localeCompare(b.name);
    });

    const externalIds = channels.value.map((c) => c.channel_id);

    // Assign sorted channels as resources
    calendarOptions.value.resources = channels.value.map((c) => ({
      id: String(c.channel_id),
      title: c.name,
    }));

    const campaigns = await fetchWC();

    const filteredCampaigns = campaigns.filter((c) =>
      externalIds.includes(c.channel_id)
    );

    // Keep sorting campaigns per channel
    filteredCampaigns.sort((a, b) => {
      if (a.channel_id !== b.channel_id) {
        return a.channel_id - b.channel_id;
      }
      return new Date(a.start_date) - new Date(b.start_date);
    });

    const adjusted = [];
    const lastEndByChannel = {};

    for (const c of filteredCampaigns) {
      let start = new Date(c.start_date);
      const end = new Date(parseEndDate(c.end_date));

      if (lastEndByChannel[c.channel_id]) {
        const prevEnd = new Date(lastEndByChannel[c.channel_id]);
        if (start > prevEnd) {
          start = new Date(prevEnd);
        }
      }

      lastEndByChannel[c.channel_id] = end;

      adjusted.push({
        id: String(c.campaign_id),
        resourceId: String(c.channel_id),
        title: c.name,
        start: start.toISOString().split("T")[0],
        end: end.toISOString().split("T")[0],
        backgroundColor: c.background_color || "#3b82f6",
        borderColor: c.background_color || "#3b82f6",
        textColor: "#fff",
      });
    }

    calendarOptions.value.events = adjusted;
  } catch (err) {
    console.error("Failed to load campaigns:", err);
  }
}


onMounted(() => {
  loadCampaigns();
});
</script>

<style scoped>
.fc {
  --fc-border-color: #374151;
  --fc-page-bg-color: #111827;
  --fc-neutral-bg-color: #1f2937;
  --fc-neutral-text-color: #d1d5db;
  --fc-button-bg-color: #374151;
  --fc-button-border-color: #4b5563;
  --fc-button-text-color: #f9fafb;
  --fc-button-hover-bg-color: #4b5563;
  --fc-today-bg-color: #1d4ed8;
  border-radius: 0.75rem;
  font-family: "Inter", sans-serif;
  color: #e5e7eb;
}

.fc-toolbar-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #f9fafb;
}

.fc-datagrid-cell-main {
  font-weight: 500;
  color: #f3f4f6;
}

.fc-event {
  border-radius: 6px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.6);
  padding: 2px 4px;
}
</style>
