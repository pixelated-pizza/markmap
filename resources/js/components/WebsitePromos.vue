<template>
    <div class="flex flex-col h-auto max-h-[88vh] overflow-auto dark:bg-gray-900 p-3 bg-gray-200">
        <h4 class="text-gray-200 font-semibold text-lg text-center p-2 mt-5">
            Website Promotions Details
        </h4>
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
            <div v-else>
                <div v-if="websitePromosStore.websitePromotions.length === 0" class="text-center text-gray-500 mt-10">
                    No website promotions found.
                </div>
                <div v-else>
                    <DataTable :value="mergedPromotions" :dataKey="row => row.promo_name"
                        v-model:expandedRows="expandedRows" class="p-datatable-sm" rowHover paginator :rows="20">
                        <Column expander style="width: 3rem" />
                        <Column field="promo_name" header="Promotion" />
                        <Column header="Scope">
                            <template #body="{ data }">
                                <div class="flex gap-2">
                                    <span class="text-md px-2 py-1 rounded"
                                        :class="data.does_include_parts ? 'bg-green-400 text-black font-bold' : 'bg-red-600 dark:text-white font-bold'">
                                        {{ data.does_include_parts ? 'Parts Included' : 'Parts Excluded' }}
                                    </span>

                                    <span class="text-md px-2 py-1 rounded"
                                        :class="data.does_include_marketplace_products ? 'bg-green-400 text-black font-bold' : 'bg-red-600 dark:text-white font-bold'">
                                        {{ data.does_include_marketplace_products ? 'Marketplace Included' :
                                            'Marketplace Excluded' }}
                                    </span>
                                </div>
                            </template>
                        </Column>
                        <Column header="Website">
                            <template #body="{ data }">
                                {{ data.storeNames }}
                            </template>
                        </Column>

                        <Column header="Status">
                            <template #body="{ data }">
                                <span class="text-md font-bold" :class="statusBadge(data.status)">
                                    {{ data.status }}
                                </span>
                            </template>
                        </Column>

                        <Column header="Actions" style="width: 10rem">
                            <template #body="{ data }">
                                <Button icon="pi pi-pencil" severity="success" label="Edit" rounded text size="medium"
                                    @click="editPromo(data)" />
                            </template>
                        </Column>
                        <template #expansion="{ data }">
                            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-4">

                                <!-- Description -->
                                <div class="bg-white dark:bg-gray-700 p-3 rounded shadow-sm">
                                    <p class="text-sm text-gray-500 dark:text-gray-300 font-semibold mb-1">Description
                                    </p>
                                    <p class="text-gray-800 dark:text-gray-100 break-words">
                                        {{ data.description || 'No description available' }}
                                    </p>
                                </div>

                                <!-- Coupon Info -->
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div class="bg-white dark:bg-gray-700 p-3 rounded shadow-sm">
                                        <p class="text-sm text-gray-500 dark:text-gray-300 font-semibold mb-1">Coupon
                                            Label</p>
                                        <p class="text-gray-800 dark:text-gray-100">{{ data.coupon_label || '-' }}</p>
                                    </div>
                                    <div class="bg-white dark:bg-gray-700 p-3 rounded shadow-sm">
                                        <p class="text-sm text-gray-500 dark:text-gray-300 font-semibold mb-1">Coupon
                                            Code</p>
                                        <p class="text-gray-800 dark:text-gray-100">{{ data.coupon_code || '-' }}</p>
                                    </div>
                                </div>

                                <!-- Dates -->
                                <div class="grid grid-cols-2 gap-4">
                                    <div class="bg-white dark:bg-gray-700 p-3 rounded shadow-sm">
                                        <p class="text-sm text-gray-500 dark:text-gray-300 font-semibold mb-1">Start
                                            Date</p>
                                        <p class="text-gray-800 dark:text-gray-100">{{
                                            dayjs(data.start_date).format('DD-MM-YYYY') }}</p>
                                    </div>
                                    <div class="bg-white dark:bg-gray-700 p-3 rounded shadow-sm">
                                        <p class="text-sm text-gray-500 dark:text-gray-300 font-semibold mb-1">End Date
                                        </p>
                                        <p class="text-gray-800 dark:text-gray-100">{{
                                            dayjs(data.end_date).format('DD-MM-YYYY') }}</p>
                                    </div>
                                </div>

                                <!-- Creatives -->
                                <div class="bg-white dark:bg-gray-700 p-3 rounded shadow-sm">
                                    <p class="text-sm text-gray-500 dark:text-gray-300 font-semibold mb-1">Creatives</p>
                                    <p class="text-gray-800 dark:text-gray-100 truncate">
                                        {{ Array.isArray(data.creatives) ? data.creatives.join(', ') : data.creatives ||
                                            'N/A' }}
                                    </p>
                                </div>

                                <!-- Terms & Conditions -->
                                <div class="bg-white dark:bg-gray-700 p-3 rounded shadow-sm">
                                    <p class="text-sm text-gray-500 dark:text-gray-300 font-semibold mb-1">Terms &
                                        Conditions</p>
                                    <p class="text-gray-800 dark:text-gray-100 break-words">
                                        {{ Array.isArray(data.terms_and_conditions) ?
                                            data.terms_and_conditions.join(',') : data.terms_and_conditions || 'No T&Cs' }}
                                    </p>
                                </div>

                                <!-- Footer: Last Updated -->
                                <p class="text-[11px] text-gray-500 dark:text-gray-400">
                                    Last Updated: {{ dayjs(data.updated_at).format('DD-MM-YYYY HH:mm') }}
                                </p>

                            </div>
                        </template>


                    </DataTable>
                </div>

                <Dialog v-model:visible="editVisible" modal header="Edit Website Promotion" :style="{ width: '640px' }"
                    class="p-fluid">
                    <div class="flex flex-col gap-6">

                        <div class="flex flex-col gap-4">
                            <div>
                                <label class="block text-xs font-medium text-gray-400 mb-1">
                                    Promotion Name
                                </label>
                                <InputText v-model="editForm.promo_name" class="w-full" />
                            </div>

                            <div>
                                <label class="block text-xs font-medium text-gray-400 mb-1">
                                    Website Store
                                </label>
                                <div>
                                    <div class="flex flex-col gap-3">
                                        <div v-for="store in stores" :key="store.store_id"
                                            class="flex items-center gap-3">
                                            <Checkbox v-model="editForm.website_stores" :value="store.store_id" />
                                            <span class="text-sm text-gray-300">
                                                {{ store.store_name }}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <div>
                                <label class="block text-xs font-medium text-gray-400 mb-1">
                                    Description
                                </label>
                                <Textarea v-model="editForm.description" rows="3" autoResize class="w-full" />
                            </div>
                            <div>
                                <label class="block text-xs font-medium text-gray-400 mb-1">
                                    Terms & Conditions (if applied)
                                </label>
                                <Textarea v-model="editForm.terms_and_conditions" rows="3" autoResize class="w-full" />
                            </div>
                        </div>
                        <div class="border-t border-gray-700 pt-4 grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-xs font-medium text-gray-400 mb-1">
                                    Coupon Label
                                </label>
                                <InputText v-model="editForm.coupon_label" />
                            </div>
                            <div>
                                <label class="block text-xs font-medium text-gray-400 mb-1">
                                    Coupon Code
                                </label>
                                <InputText v-model="editForm.coupon_code" />
                            </div>
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-xs font-medium text-gray-400 mb-1">
                                    Start Date
                                </label>
                                <Calendar v-model="editForm.start_date" dateFormat="yy-mm-dd" showIcon class="w-full" />
                            </div>

                            <div>
                                <label class="block text-xs font-medium text-gray-400 mb-1">
                                    End Date
                                </label>
                                <Calendar v-model="editForm.end_date" dateFormat="yy-mm-dd" showIcon class="w-full" />
                            </div>
                        </div>
                        <div class="flex gap-8 pt-2">
                            <div class="flex items-center gap-3">
                                <Checkbox v-model="editForm.does_include_parts" binary />
                                <span class="text-sm text-gray-300">Includes Parts</span>
                            </div>

                            <div class="flex items-center gap-3">
                                <Checkbox v-model="editForm.does_include_marketplace_products" binary />
                                <span class="text-sm text-gray-300">
                                    Includes Marketplace
                                </span>
                            </div>
                        </div>
                    </div>
                    <!-- FOOTER -->
                    <template #footer>
                        <div class="flex justify-end gap-3">
                            <Button label="Cancel" text severity="secondary" @click="editVisible = false" />
                            <Button label="Save Changes" icon="pi pi-check" severity="success" raised
                                @click="saveEdit" />
                        </div>
                    </template>
                </Dialog>
            </div>
        </div>

    </div>
</template>
<script setup>
import { onMounted, ref, getCurrentInstance, computed } from 'vue';
import dayjs from 'dayjs';
import { useWebsitePromosStore } from '@/js/stores/website_promos_store.js';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Skeleton from 'primevue/skeleton';

import { createWebsitePromotion, updateWebsitePromotion, deleteWebsitePromotion } from '@/js/api/website_promos_api';
import { fetchStores } from '@/js/api/website_campaign_api.js';
const websitePromosStore = useWebsitePromosStore();

const stores = ref([]);
const $instance = getCurrentInstance();
const toastr = $instance.appContext.config.globalProperties.$toastr;

const editVisible = ref(false);
const editForm = ref({});
const editingId = ref(null);

const expandedRows = ref({});

const loading = ref(true);

const editPromo = (mergedPromo) => {
    openEditDialog(mergedPromo);
};

const openEditDialog = (mergedPromo) => {
    editForm.value = {
        ...mergedPromo,
        promoRows: mergedPromo.promoRows || [],
        website_stores: mergedPromo.storeIds || [],
        start_date: mergedPromo.start_date ? new Date(mergedPromo.start_date) : null,
        end_date: mergedPromo.end_date ? new Date(mergedPromo.end_date) : null,
    };

    editVisible.value = true;
};
const saveEdit = async () => {
    try {
        const selectedStores = editForm.value.website_stores || [];

        // Loop through existing promos for this promo_name
        const existingPromos = websitePromosStore.websitePromotions.filter(
            p => p.promo_name === editForm.value.promo_name
        );

        for (const promo of existingPromos) {
            // Update each promo with new selected stores and other fields
            const payload = {
                ...editForm.value,
                website_store: selectedStores, // Update front-end store list
                start_date: editForm.value.start_date
                    ? dayjs(editForm.value.start_date).format('DD-MM-YYYY')
                    : null,
                end_date: editForm.value.end_date
                    ? dayjs(editForm.value.end_date).format('DD-MM-YYYY')
                    : null,
            };
            const { promo_id, promoRows, ...updatePayload } = payload;

            await updateWebsitePromotion(promo.promo_id, updatePayload);
        }
        if (selectedStores.length === 0) {
            for (const promo of existingPromos) {
                await deleteWebsitePromotion(promo.promo_id);
            }
        }
        await websitePromosStore.loadWebsitePromotions();

        editVisible.value = false;
        toastr.success('Promotion updated successfully.');
    } catch (error) {
        console.error('Failed to update promotion', error);
        toastr.error('Failed to update promotion. See console for details.');
    }
};

const loadStores = async () => {
    try {
        const data = await fetchStores();
        stores.value = data.map(store => ({
            store_id: store.store_id,
            store_name: store.store_name
        }));
    } catch (error) {
        console.error('Failed to load stores', error);
    }
};

const getPromoStatus = (promo) => {
    if (!promo.start_date || !promo.end_date) return "UPCOMING";

    const today = dayjs();
    const start = dayjs(promo.start_date);
    const end = dayjs(promo.end_date);

    if (today.isAfter(end)) return "ENDED";
    if (today.isBefore(start)) return "UPCOMING";
    return "RUNNING"; // today is between start and end
};

const mergedPromotions = computed(() => {
    const map = {};

    websitePromosStore.websitePromotions.forEach(promo => {
        const key = promo.promo_name;
        if (!map[key]) {
            map[key] = { ...promo, stores: [], storeIds: [], promoRows: [] };
        }

        if (promo.store?.store_name) {
            map[key].stores.push(promo.store.store_name.replace(/^Website - /, ''));
        }

        if (promo.store?.store_id) {
            map[key].storeIds.push(promo.store.store_id);
        }

        map[key].promoRows.push(promo); // ✅ keep original rows
    });

    return Object.values(map).map(promo => ({
        ...promo,
        storeNames: promo.stores.length ? promo.stores.join(' & ') : '-',
        status: getPromoStatus(promo),
        storeIds: promo.storeIds,
        promoRows: promo.promoRows,
    }));
});


onMounted(async () => {
    loading.value = true;

    try {
        await Promise.all([
            websitePromosStore.loadWebsitePromotions(),
            loadStores()
        ]);
    } catch (err) {
        console.error("Failed to load data:", err);
    } finally {
        loading.value = false;
    }
});


const statusBadge = (status) => {
    switch (status) {
        case 'RUNNING':
            return 'bg-green-400 text-black px-2 py-1 rounded';
        case 'ENDED':
            return 'bg-red-600 text-white px-2 py-1 rounded font-bold';
        case 'UPCOMING':
            return 'bg-yellow-500 text-black px-2 py-1 rounded';
        default:
            return 'bg-gray-300 px-2 py-1 rounded';
    }
};

</script>
