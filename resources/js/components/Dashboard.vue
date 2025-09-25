<template>
  <div>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-gray-800/80 backdrop-blur-md rounded-xl shadow-lg p-5 flex flex-col items-start">
        <div class="text-gray-400 text-sm">Total Campaigns</div>
        <div class="text-2xl font-bold text-white mt-2">128</div>
      </div>

      <div class="bg-gray-800/80 backdrop-blur-md rounded-xl shadow-lg p-5 flex flex-col items-start">
        <div class="text-gray-400 text-sm">Active Campaigns</div>
        <div class="text-2xl font-bold text-green-400 mt-2">42</div>
      </div>

      <div class="bg-gray-800/80 backdrop-blur-md rounded-xl shadow-lg p-5 flex flex-col items-start">
        <div class="text-gray-400 text-sm">Upcoming</div>
        <div class="text-2xl font-bold text-blue-400 mt-2">19</div>
      </div>

      <div class="bg-gray-800/80 backdrop-blur-md rounded-xl shadow-lg p-5 flex flex-col items-start">
        <div class="text-gray-400 text-sm">Completed</div>
        <div class="text-2xl font-bold text-purple-400 mt-2">67</div>
      </div>
    </div>
    <div class="mt-5">
      <InternalPromotions />
      <ExternalPromotions />
    </div>
    
  </div>
</template>
<script setup>
import InternalPromotions from '@/components/InternalPromotions.vue';
import ExternalPromotions from '@/components/ExternalPromotions.vue';
import { fetchCampaigns } from '@/api/campaign_service.js';


</script>