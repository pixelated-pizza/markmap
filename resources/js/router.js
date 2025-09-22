import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  { path: '/', redirect: '/dashboard' }, 
  { path: '/dashboard', component: () => import('@/components/Dashboard.vue') },
  { path: '/campaigns', component: () => import('@/components/Campaigns.vue') },
  { path: '/website_campaigns', component: () => import('@/components/WebsiteCampaigns.vue') },
  { path: '/website-sale', component: () => import('@/components/WebsiteSaleDetails.vue') },
  { path: '/marketing-dates', component: () => import('@/components/KeyMarketingDates.vue') },

];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
