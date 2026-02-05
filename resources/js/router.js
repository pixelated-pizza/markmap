import { createRouter, createWebHistory } from 'vue-router';
import AppLayout from '@/js/components/AppLayout.vue';

function isAuthenticated() {
  return !!localStorage.getItem('auth_token'); 
}

const routes = [
  { path: '/', redirect: '/login' },
  
  { path: '/login', name: 'Login', component: () => import('@/js/components/login/Login.vue') },

  {
    path: '/',
    component: AppLayout,   // <-- layout wrapper
    meta: { requiresAuth: true },
    children: [
      { path: 'dashboard', name: 'Dashboard', component: () => import('@/js/components/Dashboard.vue') },
      { path: 'campaigns', name: 'Campaigns', component: () => import('@/js/components/Campaigns.vue') },
      { path: 'website_campaigns', name: 'WebsiteCampaigns', component: () => import('@/js/components/WebsiteCampaigns.vue') },
      { path: 'website-sale', name: 'WebsiteSale', component: () => import('@/js/components/WebsiteSaleDetails.vue') },
      { path: 'marketing-dates', name: 'KeyMarketingDates', component: () => import('@/js/components/KeyMarketingDates.vue') },
      { path: 'website-promotions-archive', name: 'WebsitePromoArchive', component: () => import('@/js/components/WebsitePromoArchive.vue') },
      { path: 'website-sale-archive', name: 'WebsiteSaleArchive', component: () => import('@/js/components/WebsiteSaleArchive.vue') },
      { path: 'website-promo', name: 'WebsitePromo', component: () => import('@/js/components/WebsitePromos.vue') },
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    next('/login'); 
  } else if (to.path === '/login' && isAuthenticated()) {
    next('/dashboard');
  } else {
    next(); 
  }
});

export default router;
