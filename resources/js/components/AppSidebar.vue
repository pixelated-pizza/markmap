<template>
  <aside :class="['layout-sidebar', sidebarClass]">
    <div>
      <!-- Logo -->
      <div class="p-4 flex items-center border-b border-gray-700">
        <div class="flex-1 flex justify-center">
          <img :src="'/app_icon.png'" alt="MarketMap" class="w-24 h-24 rounded-full" />
        </div>
      </div>
      <AppMenu :model="model" />
    </div>

    <!-- User / Logout -->
    <div class="border-t border-gray-700 p-4 flex items-center gap-2 text-sm font-medium text-gray-300">
      <i class="pi pi-user text-gray-400"></i>
      <span class="font-semibold dark:text-white text-gray-900 truncate">{{ userName }}</span>
      <Button @click="handleLogout" icon="pi pi-sign-out" rounded outlined severity="contrast"
        class="hover:text-red-400 transition ml-auto" />
    </div>
  </aside>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import AppMenu from './AppMenu.vue';   
import { useUserStore } from '@/js/utils/user.js';
import Button from 'primevue/button';
import { logout } from '@/js/api/login_api.js';
import { useRouter } from 'vue-router';

const router = useRouter();
const userStore = useUserStore();

const userName = computed(() => userStore.name);

async function handleLogout() {
  try {
    await logout();
    localStorage.removeItem('auth_token');
    router.push('/login');
  } catch (err) {
    console.error(err);
  }
}

const sidebarClass = computed(() => [
  'text-gray-200 shadow-lg flex flex-col justify-between h-full overflow-hidden'
]);

onMounted(async () => {
  await userStore.fetchUser();
});
</script>
