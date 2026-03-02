<template>
  <div class="relative">
    <router-view />
    <GlobalLoader />
  </div>
</template>

<script setup>
import GlobalLoader from './components/GlobalLoader.vue'
</script>

<style scoped></style>