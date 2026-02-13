<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>
<style lang="scss" scoped></style>
<script setup>
import { ref } from 'vue';
import AppMenuItem from './AppMenuItem.vue';

const model = ref([
  { label: 'Home', items: [{ label: 'Dashboard', icon: 'pi pi-chart-bar', to: '/dashboard' }] },
  {
    label: 'Marketing Calendar',
    items: [
      {
        label: 'Website & Marketplaces Campaigns',
        icon: 'pi pi-globe',
        to: '/campaigns'
      },
      {
        label: 'Website Sales / Promotions - Mytopia & Edisons',
        icon: 'pi pi-globe',
        to: '/website_campaigns'
      },
      { label: 'Website Sale Details', icon: 'pi pi-pen-to-square', to: '/website-sale' },
      { label: 'Website Promotion Details', icon: 'pi pi-pen-to-square', to: '/website-promo' }
    ]
  },
  {
    label: 'Archive',
    items: [
      {
        label: 'Website Promotions',
        icon: 'pi pi-chart-line',
        to: '/website-promotions-archive'
      },
      { label: 'Website Sales', icon: 'pi pi-globe', to: '/website-sale-archive' },
      { label: 'Marketplace Promotions', icon: 'pi pi-shopping-bag', to: '/#' }
    ]
  },
  {
    label: 'Admin Settings',
    items: [
      {
        label: 'User Management',
        icon: 'pi pi-user',
        to: '/user-mgmt' 
      },
    ]
  }
]);

</script>
