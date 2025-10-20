<template>
  <div class="bg-gray-900 p-10">
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

    <Dialog v-model:visible="showModal" modal :draggable="false" :closable="false" class="campaign-dialog min-h-[200px]"
      :style="{ width: '480px', maxHeight: '85vh' }">
      <template #header>
        <div class="flex justify-between items-center w-full">
          <h2 class="text-xl font-bold capitalize text-white tracking-wide">
            {{ selectedStatus }} Campaigns
          </h2>
          <button @click="showModal = false" class="text-gray-400 hover:text-white text-xl font-bold transition">
            ✕
          </button>
        </div>
      </template>
      <div class="px-3 pb-3 mt-5">
        <input v-model="searchTerm" type="text" placeholder="Search campaign..."
          class="w-full px-3 py-2 bg-gray-800 text-gray-200 placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      <div class="p-2 overflow-y-auto max-h-[65vh] space-y-3">
        <transition-group name="list" tag="div">
          <div v-for="c in filteredCampaignsSorted"
            :key="c.id"
            class="cursor-pointer p-4 bg-gray-800 rounded-lg border border-gray-700 hover:border-blue-500 hover:bg-gray-700 transition duration-300 ease-in-out group">
            <div class="flex justify-between items-center mb-1">
              <h3 class="font-semibold text-white group-hover:text-blue-400 transition">
                {{ c.channel_name ? `${c.channel_name} - ${c.name}` : c.name }}
              </h3>
              <span class="text-xs px-2 py-1 rounded-full" :class="{
                'bg-green-600/20 text-green-400 border border-green-600/40': selectedStatus === 'active',
                'bg-yellow-600/20 text-yellow-400 border border-yellow-600/40': selectedStatus === 'upcoming',
                'bg-red-600/20 text-red-400 border border-red-600/40': selectedStatus === 'expired'
              }">
                {{ selectedStatus }}
              </span>
            </div>
            <div class="text-xs text-gray-400">
              {{ c.start_date }} → {{ c.end_date }}
            </div>
          </div>
        </transition-group>

        <p v-if="filteredCampaigns.length === 0" class="text-gray-400 text-sm text-center mt-4">
          No campaigns found.
        </p>
      </div>
    </Dialog>


    <div class="mt-5">
      <Tabs v-model:value="activeTab">
        <TabList>
          <Tab value="0">Internal Promotions</Tab>
          <Tab value="1">External Promotions</Tab>
        </TabList>

        <TabPanels>
          <TabPanel value="0">
            <InternalPromotions />
          </TabPanel>
          <TabPanel value="1">
            <ExternalPromotions v-if="activeTab === '1'" />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, computed } from "vue";
import InternalPromotions from '@/components/InternalPromotions.vue';
import ExternalPromotions from '@/components/ExternalPromotions.vue';
import { fetchCampaigns } from '@/api/campaign_service.js';

import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';
import Dialog from 'primevue/dialog';

const activeTab = ref("0");
const searchTerm = ref("");

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

const filteredCampaignsSorted = computed(() => {
  if (!filteredCampaigns?.value) return [];
  return filteredCampaigns.value.filter((c) =>
    c?.name?.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
});

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
<style scoped>
:deep(.campaign-dialog .p-dialog-content) {
  background-color: #111827; 
  color: white;
  padding: 0;
  border-radius: 0.75rem;
}

:deep(.campaign-dialog .p-dialog-header) {
  background-color: #1f2937; 
  border-bottom: 1px solid #374151; 
  padding: 1rem;
}

:deep(.p-dialog-mask) {
  backdrop-filter: blur(6px);
  background-color: rgba(0, 0, 0, 0.7);
}

.list-enter-active,
.list-leave-active {
  transition: all 0.25s ease;
}
.list-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.list-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

</style>