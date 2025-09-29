import { createRouter, createWebHistory } from 'vue-router';

// Example: check auth status (replace with real logic, e.g. JWT in localStorage)
function isAuthenticated() {
  return !!localStorage.getItem('auth_token'); 
}

const routes = [
  { path: '/', redirect: '/login' },

  { 
    path: '/login', 
    name: 'Login', 
    component: () => import('@/components/login/Login.vue') 
  },

  { 
    path: '/dashboard', 
    name: 'Dashboard', 
    component: () => import('@/components/Dashboard.vue'),
    meta: { requiresAuth: true } 
  },
  { 
    path: '/campaigns', 
    name: 'Campaigns',
    component: () => import('@/components/Campaigns.vue'),
    meta: { requiresAuth: true }
  },
  { 
    path: '/website_campaigns', 
    name: 'WebsiteCampaigns',
    component: () => import('@/components/WebsiteCampaigns.vue'),
    meta: { requiresAuth: true }
  },
  { 
    path: '/website-sale', 
    name: 'WebsiteSale',
    component: () => import('@/components/WebsiteSaleDetails.vue'),
    meta: { requiresAuth: true }
  },
  { 
    path: '/marketing-dates', 
    name: 'KeyMarketingDates',
    component: () => import('@/components/KeyMarketingDates.vue'),
    meta: { requiresAuth: true }
  },
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
