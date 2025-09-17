<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Sidebar -->
    <aside :class="sidebarOpen ? 'w-64' : 'w-16'" class="bg-gray-800 text-white flex-shrink-0 transition-all duration-300">
      <div class="p-4 flex items-center justify-between border-b border-gray-700">
        <span class="font-bold text-xl" v-show="sidebarOpen">MarkMap</span>
        <button @click="sidebarOpen = !sidebarOpen" class="focus:outline-none">
          <svg v-show="sidebarOpen" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none"
               viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M6 18L18 6M6 6l12 12" />
          </svg>
          <svg v-show="!sidebarOpen" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none"
               viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <nav class="mt-4">
        <ul>
          <!-- Campaign Calendar Menu -->
          <li class="px-4 py-2 hover:bg-gray-700">
            <button
              @click="submenuOpen = !submenuOpen"
              class="w-full flex justify-between items-center focus:outline-none"
              v-show="sidebarOpen"
            >
              <span>Campaign Calendar</span>
              <svg :class="{ 'rotate-90': submenuOpen }" class="w-4 h-4 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <ul v-show="submenuOpen" class="pl-6 mt-2 space-y-1 text-sm">
              <li class="px-2 py-1 hover:bg-gray-600">
                <router-link to="/campaigns" class="block" v-show="sidebarOpen">Campaigns</router-link>
              </li>
              <li class="px-2 py-1 hover:bg-gray-600">
                <router-link to="/weekly-calendar" class="block" v-show="sidebarOpen">Website Sale Details</router-link>
              </li>
              <li class="px-2 py-1 hover:bg-gray-600">
                <router-link to="/marketing-dates" class="block" v-show="sidebarOpen">Key Marketing Dates</router-link>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </aside>

    <main class="flex-1 p-6 overflow-auto transition-all duration-300">
      <router-view/>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const sidebarOpen = ref(true);
const submenuOpen = ref(false);
</script>

<style scoped>
</style>
