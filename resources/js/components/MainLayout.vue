<template>
  <div class="flex w-screen h-screen overflow-hidden">
    <aside v-if="route.path !== '/login'" :class="sidebarOpen ? 'w-64' : 'w-16'"
      class="bg-black text-gray-200 transition-all duration-300 shadow-lg flex flex-col justify-between h-full">

      <div>
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
              <i class="pi pi-home mr-2 w-4 text-center"></i>
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
      </div>

      <div class="border-t border-gray-700 p-4 items-center justify-between">
        <div v-show="sidebarOpen" class="flex items-center gap-2 text-sm font-medium text-gray-300">
          <i class="pi pi-user text-gray-400"></i>
          <span class="font-semibold text-white truncate">{{ userName }}</span>
          <Button @click="handleLogout" icon="pi pi-sign-out" rounded outlined severity="contrast"
            class="hover:text-red-400 transition ml-auto" v-show="sidebarOpen" />
          <Button @click="handleLogout" icon="pi pi-sign-out" rounded outlined severity="contrast"
            class="w-full hover:text-red-400 transition" v-show="!sidebarOpen" />
        </div>

      </div>
    </aside>

    <div class="flex flex-col flex-1 h-full">

      <header v-if="route.path !== '/login'"
        class="col-start-2 flex items-center justify-between bg-black backdrop-blur-md text-white px-6 shadow-lg border-b border-gray-700 h-16 min-h-[4rem] shrink-0">
        <h1 class="text-xl font-semibold tracking-wide drop-shadow-sm">
          MarketMap
        </h1>

        <div class="relative flex gap-2 items-center">
          <span class="font-semibold">Updates</span>
          <Button icon="pi pi-bell" rounded outlined severity="contrast" class="hover:text-yellow-400 transition"
            @click="toggleNotifications" />
          <span v-if="notifications.length"
            class="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1">
            {{ notifications.length }}
          </span>
        </div>
      </header>

      <main class="flex-1 overflow-auto bg-gray-900">
        <transition name="fade" mode="out-in">
          <router-view v-slot="{ Component }">
            <Suspense>
              <component :is="Component" />
              <template #fallback>
                <div class="p-6 space-y-6">
                  <div v-for="n in 3" :key="n" class="h-6 bg-gray-800 rounded animate-pulse"></div>
                </div>
              </template>
            </Suspense>
          </router-view>
        </transition>
      </main>
    </div>

    <Dialog header="Logging out" :visible.sync="loggingOut" modal closable="false" :dismissable-mask="false">
      <div class="flex items-center gap-2">
        <i class="pi pi-spin pi-spinner text-xl"></i>
        <span>Please wait...</span>
      </div>
    </Dialog>
  </div>
</template>


<script setup>
import { ref, getCurrentInstance, watch, computed } from "vue";
import { Suspense } from "vue";
import Skeleton from "primevue/skeleton";
import { useRoute, useRouter } from "vue-router";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import { logout } from "@/api/login_api.js";
import { useUserStore } from '@/utils/user.js';
const loggingOut = ref(false);

const userStore = useUserStore();


const { appContext } = getCurrentInstance();
const $toastr = appContext.config.globalProperties.$toastr

const route = useRoute();
const router = useRouter();

const sidebarOpen = ref(true);
const calendarMenuOpen = ref(false);
const weeklyMenuOpen = ref(false);

const isLoggedIn = ref(!!localStorage.getItem("auth_token"));

const notifications = ref([
  
  { id: 1, message: "Campaign updated successfully" },
  { id: 2, message: "New marketing date added" },
]);

function toggleNotifications() {
  $toastr.info("Notifications clicked! (You can replace this with a dropdown)");
}

watch(
  () => route.path,
  async () => {
    if (localStorage.getItem("auth_token") && !userStore.name) {
      await userStore.fetchUser();
    }
  },
  { immediate: true }
);

const userName = computed(() => userStore.name);

async function handleLogout() {
  try {
    loggingOut.value = true;

    await logout();
    localStorage.removeItem("auth_token");
    isLoggedIn.value = false;

    router.push("/login");
    $toastr.success("Logged out successfully!");
  } catch (err) {
    $toastr.error("Logout failed.");
  } finally {
    loggingOut.value = false;
    $toastr.success("Logged out successfully!");
  }
}

</script>
