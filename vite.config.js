import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";
import Components from "unplugin-vue-components/vite";
import { PrimeVueResolver } from "@primevue/auto-import-resolver";
import { fileURLToPath, URL } from "url";

export default defineConfig({
    base: "https://markmap-production.up.railway.app/",
    plugins: [
        laravel({
            input: [
                "resources/css/app.css",
                "resources/css/campaign_chart.css",
                "resources/css/internal_promos.css",
                "resources/css/external_promos.css",
                "resources/css/website_campaigns.css",
                "resources/css/mainlayout.css",
                "resources/css/dashboard.css",
                "resources/js/app.js",
            ],
            refresh: true,
        }),
        tailwindcss(),
        vue(),
        Components({
            resolvers: [PrimeVueResolver()],
        }),
    ],

    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./resources", import.meta.url)),
            vue: "vue/dist/vue.esm-bundler.js",
        },
        dedupe: ["@fullcalendar/core"],
    },
    build: {
        outDir: "public/build",
        emptyOutDir: true,
    },
    css: {
        preprocessorOptions: {
            scss: {
                includePaths: ["resources/css/assets/variables"],
            },
        },
    },
});
