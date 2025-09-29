<template>
  <div class="bg-gray-900">
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div
        class="bg-gray-800/80 backdrop-blur-md rounded-xl shadow-lg p-5 flex flex-col items-start cursor-pointer hover:bg-gray-700/80 transition"
        @click="openModal('total')">
        <div class="text-gray-400 text-sm">Total Campaigns</div>
        <div class="text-2xl font-bold text-white mt-2">{{ stats.total }}</div>
      </div>

      <div
        class="bg-gray-800/80 backdrop-blur-md rounded-xl shadow-lg p-5 flex flex-col items-start cursor-pointer hover:bg-gray-700/80 transition"
        @click="openModal('active')">
        <div class="text-gray-400 text-sm">Active Campaigns</div>
        <div class="text-2xl font-bold text-green-400 mt-2">{{ stats.active }}</div>
      </div>

      <div
        class="bg-gray-800/80 backdrop-blur-md rounded-xl shadow-lg p-5 flex flex-col items-start cursor-pointer hover:bg-gray-700/80 transition"
        @click="openModal('upcoming')">
        <div class="text-gray-400 text-sm">Upcoming</div>
        <div class="text-2xl font-bold text-blue-400 mt-2">{{ stats.upcoming }}</div>
      </div>

      <div
        class="bg-gray-800/80 backdrop-blur-md rounded-xl shadow-lg p-5 flex flex-col items-start cursor-pointer hover:bg-gray-700/80 transition"
        @click="openModal('completed')">
        <div class="text-gray-400 text-sm">Completed</div>
        <div class="text-2xl font-bold text-purple-400 mt-2">{{ stats.completed }}</div>
      </div>
    </div>

    <div v-if="showModal" class="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
      <div class="bg-gray-900 text-white rounded-lg shadow-xl relative w-96 max-h-[80vh] flex flex-col">

        <div class="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 class="text-lg font-bold capitalize">{{ selectedStatus }} Campaigns</h2>
          <button @click="showModal = false" class="text-gray-400 hover:text-white text-xl font-bold">
            ✕
          </button>
        </div>

        <div class="p-4 overflow-y-auto flex-1">
          <ul v-if="filteredCampaigns.length > 0" class="space-y-2">
            <li v-for="c in filteredCampaigns" :key="c.id" class="p-2 bg-gray-800 rounded">
              <div class="font-semibold">{{ c.name }}</div>
              <div class="text-xs text-gray-400">{{ c.start_date }} → {{ c.end_date }}</div>
            </li>
          </ul>
          <p v-else class="text-gray-400 text-sm">No campaigns found.</p>
        </div>
      </div>
    </div>

    <div class="mt-5">
      <InternalPromotions />
      <ExternalPromotions />
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import InternalPromotions from '@/components/InternalPromotions.vue';
import ExternalPromotions from '@/components/ExternalPromotions.vue';
import { fetchCampaigns } from '@/api/campaign_service.js';

const stats = ref({
  total: 0,
  active: 0,
  upcoming: 0,
  completed: 0
});

const campaigns = ref([]);
const showModal = ref(false);
const selectedStatus = ref("");
const filteredCampaigns = ref([]);

function openModal(status) {
  selectedStatus.value = status;
  showModal.value = true;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (status === "total") {
    filteredCampaigns.value = campaigns.value;
  } else if (status === "active") {
    filteredCampaigns.value = campaigns.value.filter(c => {
      const start = new Date(c.start_date);
      const end = new Date(c.end_date);
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);
      return today >= start && today <= end;
    });
  } else if (status === "upcoming") {
    filteredCampaigns.value = campaigns.value.filter(c => {
      const start = new Date(c.start_date);
      start.setHours(0, 0, 0, 0);
      return start > today;
    });
  } else if (status === "completed") {
    filteredCampaigns.value = campaigns.value.filter(c => {
      const end = new Date(c.end_date);
      end.setHours(0, 0, 0, 0);
      return end < today;
    });
  }
}

onMounted(async () => {
  try {
    const result = await fetchCampaigns();
    campaigns.value = result;
    stats.value.total = result.length;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    result.forEach(c => {
      const start = new Date(c.start_date);
      const end = new Date(c.end_date);

      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);

      if (today >= start && today <= end) {
        stats.value.active++;
      } else if (start > today) {
        stats.value.upcoming++;
      } else if (end < today) {
        stats.value.completed++;
      }
    });

  } catch (err) {
    console.error("Failed to fetch campaigns:", err);
  }
});
</script>
