<template>
  <div class="w-screen h-screen grid grid-rows-[auto,1fr] grid-cols-[auto,1fr]">
    <aside v-if="route.path !== '/login'" :class="sidebarOpen ? 'w-64' : 'w-16'"
      class="row-span-2 bg-gradient-to-b from-gray-900 to-gray-800 text-gray-200 transition-all duration-300 shadow-lg">

      <div class="p-4 flex items-center border-b border-gray-700">
        <div class="flex-1 flex justify-center">
          <img v-show="sidebarOpen" :src="'/app_icon.png'" alt="MarketMap" class="w-24 h-24 rounded-full" />
        </div>
        <button @click="sidebarOpen = !sidebarOpen"
          class="focus:outline-none text-gray-400 hover:text-white transition ml-2">
          <i class="pi pi-bars text-xl"></i>
        </button>
      </div>

      <nav class="mt-4 space-y-2">
        <li>
          <router-link to="/dashboard"
            class="flex items-center px-4 py-2 rounded-lg hover:bg-gray-700 hover:text-white transition"
            active-class="bg-gray-700 text-white border-l-4 border-blue-500" v-show="sidebarOpen">
            <i class="pi pi-home mr-3 w-5 text-center"></i>
            Dashboard
          </router-link>
        </li>

        <li class="px-2">
          <button @click="calendarMenuOpen = !calendarMenuOpen"
            class="w-full flex justify-between items-center px-2 py-2 text-sm font-medium rounded-lg hover:bg-gray-700 hover:text-white transition"
            v-show="sidebarOpen">
            <span class="flex items-center">
              <i class="pi pi-calendar mr-2 w-4 text-center"></i>
              Marketing Calendar
            </span>
            <i :class="['pi pi-chevron-right transition-transform', { 'rotate-90': calendarMenuOpen }]"></i>
          </button>

          <ul v-show="calendarMenuOpen" class="pl-6 mt-2 space-y-1 text-sm text-gray-300">
            <li>
              <button @click="weeklyMenuOpen = !weeklyMenuOpen"
                class="w-full flex justify-between items-center px-2 py-1 rounded hover:bg-gray-600 transition"
                v-show="sidebarOpen">
                <span class="flex items-center">
                  <i class="pi pi-calendar mr-2 w-4 text-center"></i>
                  Weekly Calendar
                </span>
                <i :class="['pi pi-chevron-right transition-transform', { 'rotate-90': weeklyMenuOpen }]"></i>
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

    <header class="col-start-2 flex items-center justify-between bg-gray-800 text-white px-6 py-3 shadow-md"
      v-if="route.path !== '/login'">
      <h1 class="text-lg font-bold">MarketMap</h1>
      <div class="flex items-center gap-4">
        <span class="text-sm font-medium">Hi, {{ userName }}</span>
        <Button icon="pi pi-power-off" class="p-button-sm p-button-danger" @click="handleLogout" />
      </div>
    </header>

    <main class="col-start-2 overflow-auto bg-gray-50">
      <router-view />
    </main>

    <Dialog header="Logging out" :visible.sync="loggingOut" modal closable="false" :dismissable-mask="false">
      <div class="flex items-center gap-2">
        <i class="pi pi-spin pi-spinner text-xl"></i>
        <span>Please wait...</span>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance } from "vue";
import { useRoute, useRouter } from "vue-router";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import { logout, getName } from "@/api/login_api.js";
const loggingOut = ref(false);

const { appContext } = getCurrentInstance();
const $toastr = appContext.config.globalProperties.$toastr

const route = useRoute();
const router = useRouter();

const sidebarOpen = ref(true);
const calendarMenuOpen = ref(false);
const weeklyMenuOpen = ref(false);
const userName = ref(null);

const isLoggedIn = ref(!!localStorage.getItem("auth_token"));

onMounted(async () => {
  try {
    const { name } = await getName();
    userName.value = name;
  } catch (err) {
    console.error("Failed to fetch user name:", err);
  }
});

async function handleLogout() {
  try {
    loggingOut.value = true;

    await logout();
    localStorage.removeItem("auth_token");
    isLoggedIn.value = false;

    router.push("/login");
    $toastr.success("Logged out successfully!");
  } catch (err) {
    console.error("Logout failed:", err);
    $toastr.error("Logout failed.");
  } finally {
    loggingOut.value = false;
    $toastr.success("Logged out successfully!");
  }
}

</script>
