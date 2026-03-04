import { createRouter, createWebHistory } from "vue-router";
import AppLayout from "@/js/components/AppLayout.vue";
import { getActivePinia } from "pinia";

// 🔥 EAGER LOAD most-used page
import Dashboard from "@/js/components/dashboard/Dashboard.vue";

function isAuthenticated() {
    return !!localStorage.getItem("auth_token");
}

const routes = [
    { path: "/", redirect: "/login" },

    // Login stays lazy (not used often once logged in)
    {
        path: "/login",
        name: "Login",
        component: () => import("@/js/components/login/Login.vue"),
    },

    {
        path: "/",
        component: AppLayout,
        meta: { requiresAuth: true },
        children: [
            // ⚡ Instant load (most important page)
            {
                path: "dashboard",
                name: "Dashboard",
                component: Dashboard,
            },

            // ⚡ Prefetched after initial load
            {
                path: "campaigns",
                name: "Campaigns",
                component: () =>
                    import(
                        /* webpackPrefetch: true */
                        "@/js/components/campaigns/Campaigns.vue"
                    ),
            },

            {
                path: "website_campaigns",
                name: "WebsiteCampaigns",
                component: () =>
                    import(
                        /* webpackPrefetch: true */
                        "@/js/components/WebsiteCampaigns.vue"
                    ),
            },

            {
                path: "website-sale",
                name: "WebsiteSale",
                component: () =>
                    import(
                        /* webpackPrefetch: true */
                        "@/js/components/WebsiteSaleDetails.vue"
                    ),
            },

            {
                path: "website-promo",
                name: "WebsitePromo",
                component: () =>
                    import(
                        /* webpackPrefetch: true */
                        "@/js/components/WebsitePromos.vue"
                    ),
            },

            // 💤 Rare / archive pages stay fully lazy
            {
                path: "website-promotions-archive",
                name: "WebsitePromoArchive",
                component: () =>
                    import("@/js/components/WebsitePromoArchive.vue"),
            },

            {
                path: "website-sale-archive",
                name: "WebsiteSaleArchive",
                component: () =>
                    import("@/js/components/WebsiteSaleArchive.vue"),
            },

            {
                path: "marketing-dates",
                name: "KeyMarketingDates",
                component: () =>
                    import("@/js/components/KeyMarketingDates.vue"),
            },

            {
                path: "user-mgmt",
                name: "UserMgmt",
                component: () =>
                    import("@/js/components/super_admin/UserMgmt.vue"),
            },

            {
                path: "forgot-password",
                name: "ResetPassword",
                component: () =>
                    import("@/js/components/login/ResetPassword.vue"),
            },
        ],
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// router.beforeEach((to, from, next) => {
//   const pinia = getActivePinia()
//   const ui = pinia?._s?.ui ? pinia._s.ui : null  // see note below
//   ui?.showLoader?.()

//   if (to.meta.requiresAuth && !isAuthenticated()) {
//     next("/login")
//   } else if (to.path === "/login" && isAuthenticated()) {
//     next("/dashboard")
//   } else {
//     next()
//   }
// })

// router.afterEach(() => {
//   const pinia = getActivePinia()
//   const ui = pinia?._s?.ui ? pinia._s.ui : null
//   ui?.hideLoader?.()
// })

export default router;
