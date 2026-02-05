<template>
    <div class="flex flex-col w-full h-full bg-gray-900 px-6 overflow-x-auto">
        <h2 class="text-gray-200 font-semibold text-lg text-center p-2 bg-cyan-900 mt-5">
            Website Sale Archive
        </h2>
        <div>
            <template v-if="loading">
                <div class="flex flex-col gap-4 w-full h-full mt-5">
                    <p class="text-gray-400 text-lg">Loading Data...</p>
                    <Skeleton height="2rem" width="70%" />
                    <Skeleton height="2rem" width="50%" />
                    <Skeleton height="1rem" width="90%" />
                    <Skeleton height="1rem" width="85%" />
                    <Skeleton height="1rem" width="95%" />
                    <div class="flex-1 mt-2">
                        <Skeleton height="100%" borderRadius="8px" />
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>
<script setup>
import { onMounted, ref, getCurrentInstance } from 'vue';
import { useArchiveWebsiteSalesStore } from '@/js/stores/archive_website_sales_store.js';
const archiveWebsiteSales = useArchiveWebsiteSalesStore();

import Skeleton from 'primevue/skeleton';

const loading = ref(true);

onMounted(async () => {
    loading.value = true;

    // await Promise.all([
    //     archiveStore.loadArchivedPromotions(),
    //     loadStores()
    // ]);

    loading.value = false;
});
</script>