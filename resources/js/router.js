import { createRouter, createWebHistory } from "vue-router";
import AppLayout from "@/js/components/AppLayout.vue";

// Eager load most-used pages
import Dashboard from "@/js/components/dashboard/Dashboard.vue";

function isAuthenticated() {
    return !!localStorage.getItem("auth_token");
}

const routes = [
    { path: "/", redirect: "/login" },

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
            {
                path: "dashboard",
                name: "Dashboard",
                component: Dashboard,
            },
            {
                path: "campaigns",
                name: "Campaigns",
                component: () =>
                    import(
                        /* webpackPrefetch: true */
                        /* webpackChunkName: "campaigns" */
                        "@/js/components/campaigns/Campaigns.vue"
                    ),
            },
            {
                path: "website_campaigns",
                name: "WebsiteCampaigns",
                component: () =>
                    import(
                        /* webpackPrefetch: true */
                        /* webpackChunkName: "website-campaigns" */
                        "@/js/components/WebsiteCampaigns.vue"
                    ),
            },
            {
                path: "website-sale",
                name: "WebsiteSale",
                component: () =>
                    import(
                        /* webpackPrefetch: true */
                        /* webpackChunkName: "website-sale" */
                        "@/js/components/WebsiteSaleDetails.vue"
                    ),
            },
            {
                path: "website-promo",
                name: "WebsitePromo",
                component: () =>
                    import(
                        /* webpackPrefetch: true */
                        /* webpackChunkName: "website-promo" */
                        "@/js/components/WebsitePromos.vue"
                    ),
            },

            // Less frequent — lazy only
            {
                path: "website-promotions-archive",
                name: "WebsitePromoArchive",
                component: () =>
                    import(
                        /* webpackChunkName: "archives" */
                        "@/js/components/WebsitePromoArchive.vue"
                    ),
            },
            {
                path: "website-sale-archive",
                name: "WebsiteSaleArchive",
                component: () =>
                    import(
                        /* webpackChunkName: "archives" */
                        "@/js/components/WebsiteSaleArchive.vue"
                    ),
            },
            {
                path: "marketing-dates",
                name: "KeyMarketingDates",
                component: () =>
                    import(
                        /* webpackChunkName: "misc" */
                        "@/js/components/KeyMarketingDates.vue"
                    ),
            },
            {
                path: "user-mgmt",
                name: "UserMgmt",
                component: () =>
                    import(
                        /* webpackChunkName: "admin" */
                        "@/js/components/super_admin/UserMgmt.vue"
                    ),
            },
            {
                path: "forgot-password",
                name: "ResetPassword",
                component: () =>
                    import(
                        /* webpackChunkName: "misc" */
                        "@/js/components/login/ResetPassword.vue"
                    ),
            },
            {
                path: "category-featured-skus",
                name: "CategoryFeaturedSkus",
                component: () =>
                    import(
                        /* webpackChunkName: "misc" */
                        "@/js/components/category_featured_skus/CategoryFeaturedSkus.vue"
                    ),
            },
        ],
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// Track if we're doing the initial navigation (login → dashboard)
// so we don't show loader on that transition
let initialNavDone = false;

router.beforeEach((to, from, next) => {
    // Auth guard
    if (to.meta.requiresAuth && !isAuthenticated()) {
        return next("/login");
    }
    if (to.path === "/login" && isAuthenticated()) {
        return next("/dashboard");
    }

    // Show loader only for lazy-loaded routes after initial nav
    if (initialNavDone && to.name !== "Dashboard") {
        const appEl = document.getElementById("app");
        appEl?.classList.add("route-loading");
    }

    next();
});

router.afterEach(() => {
    initialNavDone = true;
    const appEl = document.getElementById("app");
    appEl?.classList.remove("route-loading");
});

export default router;