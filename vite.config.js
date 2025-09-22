import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import {PrimeVueResolver} from "@primevue/auto-import-resolver";

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.js'],
            refresh: true,
        }),
        tailwindcss(),
        vue(),
        Components({ resolvers: [PrimeVueResolver()], 
        }),
    ],

    resolve: {
        alias: {
            '@': '/resources/js',
            '@/components': '/resources/js/components',
            '@/api': '/resources/js/api',
            '@/views': '/resources/js/views',
            '@/router': '/resources/js/router.js',
            'vue': 'vue/dist/vue.esm-bundler.js',
        },
    },
});
