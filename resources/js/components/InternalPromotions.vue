<template>
  <div class="w-full mt-3 bg-gray-900 rounded-lg p-3 min-h-[500px]">
    <FullCalendar ref="calendarRef" :options="calendarOptions" class="w-full h-full" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import FullCalendar from "@fullcalendar/vue3";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
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
  resourceAreaHeaderContent: "Website",
  resources: [],
  resourceOrder: null,
  events: [],
  editable: false,
  selectable: false,
  aspectRatio: 2,
  height: 500,
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

    channels.value = allowedChannels
      .map((name) => allChannels.find((c) => c.name === name))
      .filter(Boolean);

    const allowedIds = channels.value.map((c) => c.channel_id);

    calendarOptions.value.resources = channels.value.map((c) => ({
      id: String(c.channel_id),
      title: c.name,
    }));

    const campaigns = await fetchWC();
    const filteredCampaigns = campaigns.filter((c) =>
      allowedIds.includes(c.channel_id)
    );

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
        if (start.getTime() === prevEnd.getTime()) {
          const lastEvent = adjusted[adjusted.length - 1];
          lastEvent.end = end.toISOString().split("T")[0];

          lastEndByChannel[c.channel_id] = end;
          continue;
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
