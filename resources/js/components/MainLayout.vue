<template>
  <div class="flex w-screen h-screen">
    <aside
      :class="sidebarOpen ? 'w-64' : 'w-16'"
      class="bg-gradient-to-b from-gray-900 to-gray-800 text-gray-200 flex-shrink-0 transition-all duration-300 h-full shadow-lg"
    >
      <!-- Sidebar header -->
      <div class="p-4 flex items-center justify-between border-b border-gray-700">
        <span class="font-bold text-xl tracking-wide" v-show="sidebarOpen">MarketMap</span>
        <button
          @click="sidebarOpen = !sidebarOpen"
          class="focus:outline-none text-gray-400 hover:text-white transition"
        >
          <svg
            v-show="sidebarOpen"
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          <svg
            v-show="!sidebarOpen"
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <!-- Sidebar navigation -->
      <nav class="mt-4 space-y-2">
        <!-- Dashboard -->
        <li>
          <router-link
            to="/dashboard"
            class="flex items-center px-4 py-2 rounded-lg hover:bg-gray-700 hover:text-white transition"
            active-class="bg-gray-700 text-white border-l-4 border-blue-500"
            v-show="sidebarOpen"
          >
            <i class="pi pi-home mr-3 w-5 text-center"></i>
            Dashboard
          </router-link>
        </li>

        <!-- Marketing Calendar -->
        <li class="px-2">
          <button
            @click="calendarMenuOpen = !calendarMenuOpen"
            class="w-full flex justify-between items-center px-2 py-2 text-sm font-medium rounded-lg hover:bg-gray-700 hover:text-white transition"
            v-show="sidebarOpen"
          >
            <span class="flex items-center">
              <i class="pi pi-calendar mr-2 w-4 text-center"></i>
              Marketing Calendar
            </span>
            <svg
              :class="{ 'rotate-90': calendarMenuOpen }"
              class="w-4 h-4 transition-transform text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <!-- Calendar submenu -->
          <ul v-show="calendarMenuOpen" class="pl-6 mt-2 space-y-1 text-sm text-gray-300">
            <!-- Weekly Calendar -->
            <li>
              <button
                @click="weeklyMenuOpen = !weeklyMenuOpen"
                class="w-full flex justify-between items-center px-2 py-1 rounded hover:bg-gray-600 transition"
                v-show="sidebarOpen"
              >
                <span class="flex items-center">
                  <i class="pi pi-calendar-week mr-2 w-4 text-center"></i>
                  Weekly Calendar
                </span>
                <svg
                  :class="{ 'rotate-90': weeklyMenuOpen }"
                  class="w-4 h-4 transition-transform text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <ul v-show="weeklyMenuOpen" class="pl-6 mt-2 space-y-1 text-xs text-gray-400">
                <li class="px-2 py-1 rounded hover:bg-gray-600">
                  <router-link to="/campaigns" class="flex items-center" v-show="sidebarOpen">
                    <i class="pi pi-globe mr-2 w-4 text-center"></i>
                    Website & Marketplaces Campaigns
                  </router-link>
                </li>
                <li class="px-2 py-1 rounded hover:bg-gray-600">
                  <router-link to="/website_campaigns" class="flex items-center" v-show="sidebarOpen">
                    <i class="pi pi-globe mr-2 w-4 text-center"></i>
                    Website - Mytopia & Edisons
                  </router-link>
                </li>
              </ul>
            </li>
            <li class="px-2 py-1 rounded hover:bg-gray-600">
              <router-link to="/website-sale" class="flex items-center" v-show="sidebarOpen">
                <i class="pi pi-shopping-cart mr-2 w-4 text-center"></i>
                Website Sale Details
              </router-link>
            </li>
            <li class="px-2 py-1 rounded hover:bg-gray-600">
              <router-link to="/marketing-dates" class="flex items-center" v-show="sidebarOpen">
                <i class="pi pi-calendar-plus mr-2 w-4 text-center"></i>
                Key Marketing Dates
              </router-link>
            </li>
          </ul>
        </li>
      </nav>
    </aside>

    <main class="flex-1 overflow-auto bg-gray-100 dark:bg-gray-900 p-6" style="width: 100%; height: 100%;">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { ref } from "vue";

const sidebarOpen = ref(true);
const calendarMenuOpen = ref(false);
const weeklyMenuOpen = ref(false);
</script>
