import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';


export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.js'],
            refresh: true,
        }),
        tailwindcss(),
        vue(),
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
