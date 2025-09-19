import { createRouter, createWebHistory } from 'vue-router';
import Campaigns from './components/Campaigns.vue';
import WebsiteSaleDetails from './components/WebsiteSaleDetails.vue';
import KeyMarketingDates from './components/KeyMarketingDates.vue';

const routes = [
  { path: '/', redirect: '/campaigns' }, 
  { path: '/campaigns', component: Campaigns },
  { path: '/website-sale', component: WebsiteSaleDetails },
  { path: '/marketing-dates', component: KeyMarketingDates },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
