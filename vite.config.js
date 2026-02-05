import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import { PrimeVueResolver } from "@primevue/auto-import-resolver";
import { fileURLToPath, URL } from 'url';

export default defineConfig({
    server: {
        host: '192.168.23.132',
        port: 5173,
        cors: true
    },
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.js'],
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
        '@': fileURLToPath(new URL('./resources', import.meta.url)),
        'vue': 'vue/dist/vue.esm-bundler.js',
    },
        dedupe: ['@fullcalendar/core'],
    },
    css: {
        preprocessorOptions: {
            scss: {
                 includePaths: ['resources/css/assets/variables']
            }
        }
    }
});
