<template>
    <div class="layout-wrapper" :class="containerClass">
        <AppTopbar />
        <AppSidebar />

        <div class="layout-main-container">
            <div class="layout-main">

                <Suspense>
                    <template #default>
                        <router-view />
                    </template>

                    <template #fallback>
                        <div class="p-6 text-gray-400 animate-pulse">
                            Loading page...
                        </div>
                    </template>
                </Suspense>

            </div>
        </div>

        <div class="layout-mask animate-fadein" @click="hideMobileMenu" />
    </div>

    <Toast />
</template>
<script setup>
import { useLayout } from '@/js/layouts/composables/layout';
import { computed } from 'vue';
import AppSidebar from './AppSidebar.vue';
import AppTopbar from './AppTopbar.vue';

const { layoutConfig, layoutState, hideMobileMenu } = useLayout();

const containerClass = computed(() => {
    return {
        'layout-overlay': layoutConfig.menuMode === 'overlay',
        'layout-static': layoutConfig.menuMode === 'static',
        'layout-overlay-active': layoutState.overlayMenuActive,
        'layout-mobile-active': layoutState.mobileMenuActive,
        'layout-static-inactive': layoutState.staticMenuInactive
    };
});
</script>