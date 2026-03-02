<template>
  <div class="relative">
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view>

    <GlobalLoader />
  </div>
</template>

<script setup>
import GlobalLoader from './components/GlobalLoader.vue'
</script>