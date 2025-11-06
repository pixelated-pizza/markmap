<template>
  <div class="w-full mt-3 bg-gray-900 rounded-lg p-3 min-h-[500px]">
    <template v-if="loading">
      <div class="flex flex-col h-full gap-4">
        <p class="text-gray-400 text-lg">Loading Gantt Chart...</p>
        <Skeleton height="1.5rem" width="60%" />
        <Skeleton height="1.5rem" width="80%" />
        <Skeleton height="1.5rem" width="40%" />
        <Skeleton height="1.5rem" width="60%" />
        <Skeleton height="1.5rem" width="70%" />
        <Skeleton height="1.5rem" width="90%" />
        <Skeleton height="1.5rem" width="40%" />
        <Skeleton height="1.5rem" width="60%" />
      </div>
    </template>
    <FullCalendar v-else ref="calendarRef" :options="calendarOptions" class="w-full h-full" />
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
import Skeleton from "primevue/skeleton";

const calendarRef = ref(null);
const channels = ref([]);

const loading = ref(true);

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

    for (const c of filteredCampaigns) {
      const start = new Date(c.start_date);
      const end = new Date(c.end_date);

      end.setDate(end.getDate() + 1);

      const formatDate = (date) => {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        return d.toISOString().split("T")[0]; 
      };

      adjusted.push({
        id: String(c.campaign_id),
        resourceId: String(c.channel_id),
        title: c.name,
        start: formatDate(start),
        end: formatDate(end), 
        backgroundColor: c.background_color || "#3b82f6",
        borderColor: c.background_color || "#3b82f6",
        textColor: "#fff",
      });
    }


    if (adjusted.length > 0) {
      const minStart = adjusted.reduce(
        (min, e) => (new Date(e.start) < min ? new Date(e.start) : min),
        new Date(adjusted[0].start)
      );
      const maxEnd = adjusted.reduce(
        (max, e) => (new Date(e.end) > max ? new Date(e.end) : max),
        new Date(adjusted[0].end)
      );

      maxEnd.setDate(maxEnd.getDate() + 1);

      calendarOptions.value.visibleRange = {
        start: minStart.toISOString().split("T")[0],
        end: maxEnd.toISOString().split("T")[0],
      };

      calendarOptions.value.slotDuration = { days: 1 };
    }


    calendarOptions.value.events = adjusted;
  } catch (err) {
    console.error("Failed to load campaigns:", err);
  } finally {
    loading.value = false;
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
