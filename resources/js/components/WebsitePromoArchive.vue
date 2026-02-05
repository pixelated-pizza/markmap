<template>
    <div class="flex flex-col w-full h-full bg-gray-900 px-6 overflow-x-auto">
        <h4 class="text-gray-200 font-semibold text-lg text-center p-2 mt-5">
            Archived Website Promotions
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
                <div v-if="archiveStore.archivedPromotions.length === 0" class="text-center text-gray-500 mt-10">
                    No archived promotions found.
                </div>
                <div v-else>
                    <DataTable :value="archiveStore.archivedPromotions" dataKey="promo_id"
                        v-model:expandedRows="expandedRows" class="p-datatable-sm" rowHover paginator :rows="20">
                        <Column expander style="width: 3rem" />
                        <Column field="promo_name" header="Promotion" />
                        <Column header="Scope">
                            <template #body="{ data }">
                                <div class="flex gap-2">
                                    <span class="text-md px-2 py-1 rounded"
                                        :class="data.does_include_parts ? 'bg-green-600' : 'bg-red-600'">
                                        {{ data.does_include_parts ? 'Parts Included' : 'Parts Excluded' }}
                                    </span>

                                    <span class="text-md px-2 py-1 rounded"
                                        :class="data.does_include_marketplace_products ? 'bg-green-600' : 'bg-red-600'">
                                        {{ data.does_include_marketplace_products ? 'Marketplace Included' : 'Marketplace Excluded' }}
                                    </span>
                                </div>
                            </template>
                        </Column>
                        <Column header="Website">
                            <template #body="{ data }">
                                {{ data.website_store || '-' }}
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
                                <Button icon="pi pi-pencil" severity="success" rounded text size="medium"
                                    @click="editPromo(data)" />
                                <Button icon="pi pi-folder" severity="warn" rounded text size="medium"
                                    @click="confirmUnarchive(data)" />
                            </template>
                        </Column>
                        <template #expansion="{ data }">
                            <div class="p-4 bg-black rounded-lg">
                                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-white">

                                    <div>
                                        <p class="text-md text-gray-300">Description</p>
                                        <p class="break-words text-green-500 font-bold">{{ data.description || 'No description' }}</p>
                                    </div>
                                    <div>
                                        <p class="text-md text-gray-300">Terms & Conditions</p>
                                        <p class="break-words text-red-400 font-bold">
                                            {{ Array.isArray(data.terms_and_conditions)
                                                ? data.terms_and_conditions.join(', ')
                                                : data.terms_and_conditions || '-' }}
                                        </p>
                                    </div>
                                    <div>
                                        <p class="text-md text-gray-300">Coupon Label</p>
                                        <p>{{ data.coupon_label || '-' }}</p>
                                    </div>
                                    <div>
                                        <p class="text-md text-gray-300">Coupon Code</p>
                                        <p>{{ data.coupon_code || '-' }}</p>
                                    </div>
                                    <div>
                                        <p class="text-md text-gray-300">Creatives</p>
                                        <p class="truncate">
                                            {{ Array.isArray(data.creatives)
                                                ? data.creatives.join(', ')
                                                : data.creatives || '-' }}
                                        </p>
                                    </div>
                                    <div>
                                        <p class="text-md text-gray-300">Start Date</p>
                                        <p class="text-green-500">{{ dayjs(data.start_date).format('DD-MM-YYYY') }}</p>
                                    </div>
                                    <div>
                                        <p class="text-md text-gray-300">End Date</p>
                                        <p class="text-green-500">{{ dayjs(data.end_date).format('DD-MM-YYYY') }}</p>
                                    </div>
                                </div>
                                <p class="text-[11px] text-gray-300 mt-4">
                                    Last Updated: {{ dayjs(data.updated_at).format('DD-MM-YYYY HH:mm') }}
                                </p>
                            </div>
                        </template>
                    </DataTable>
                </div>
                <Dialog v-model:visible="editVisible" modal header="Edit Archived Promotion" :style="{ width: '640px' }"
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
                                <Dropdown v-model="editForm.website_store" :options="stores" optionLabel="store_name"
                                    optionValue="store_id" placeholder="Select Website" class="w-full" />
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

                <Dialog v-model:visible="showArchiveDialog" header="Confirm Unrchive" :modal="true" :closable="false"
                    :style="{ width: '400px' }">
                    <p>Are you sure you want to archive this campaign?</p>
                    <template #footer>
                        <Button label="No" severity="danger" text @click="showArchiveDialog = false" />
                        <Button label="Yes" severity="success" @click="archiveConfirmed" />
                    </template>
                </Dialog>
            </div>
        </div>
    </div>
</template>
<script setup>
import { onMounted, ref, getCurrentInstance } from 'vue';
import dayjs from 'dayjs';
import { useArchivePromosStore } from '@/js/stores/archive_promos_store.js';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Skeleton from 'primevue/skeleton';

import { updateArchivedPromotion, fetchUnarchivePromotion } from '@/js/api/archive_promos_api';
import { fetchStores } from '@/js/api/website_campaign_api.js';
const archiveStore = useArchivePromosStore();

const stores = ref([]);
const $instance = getCurrentInstance();
const toastr = $instance.appContext.config.globalProperties.$toastr;

const showArchiveDialog = ref(false);
const promoToUnarchive = ref(null);

const editVisible = ref(false);
const editForm = ref({});
const editingId = ref(null);

const expandedRows = ref({});

const loading = ref(true);



const editPromo = (promo) => {
    editingId.value = promo.promo_id;
    editForm.value = {
        ...promo,
        terms_and_conditions: promo.terms_and_conditions || '',
        website_store: promo.store_id || null,
        start_date: promo.start_date ? new Date(promo.start_date) : null,
        end_date: promo.end_date ? new Date(promo.end_date) : null,
    };
    editVisible.value = true;
};

const saveEdit = async () => {
    try {
        await updateArchivedPromotion(editingId.value, {
            ...editForm.value,
            start_date: dayjs(editForm.value.start_date).format('DD-MM-YYYY'),
            end_date: dayjs(editForm.value.end_date).format('DD-MM-YYYY'),
        });

        editVisible.value = false;
        await archiveStore.loadArchivedPromotions();
        toastr.success("Data Updated successfully.");
    } catch (error) {
        console.error('Failed to update promotion', error);
    }
};

const confirmUnarchive = (promo) => {
    promoToUnarchive.value = promo;
    showArchiveDialog.value = true;
};

const archiveConfirmed = async () => {
    try {
        await fetchUnarchivePromotion(promoToUnarchive.value.promo_id);
        await archiveStore.loadArchivedPromotions();

        toastr.success("Promotion unarchived successfully.");
    } catch (error) {
        console.error('Failed to unarchive promotion', error);
        toastr.error("Failed to unarchive promotion.");
    } finally {
        showArchiveDialog.value = false;
        promoToUnarchive.value = null;
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


onMounted(async () => {
    loading.value = true;

    await Promise.all([
        archiveStore.loadArchivedPromotions(),
        loadStores()
    ]);

    loading.value = false;
});

const statusBadge = (status) => {
    switch (status) {
        case 'ACTIVE': return 'bg-green-500 text-white px-2 py-1 rounded';
        case 'ENDED': return 'bg-white text-red-500 px-2 py-1 rounded font-bold';
        case 'UP NEXT': return 'bg-yellow-500 text-black px-2 py-1 rounded';
        default: return 'bg-gray-300 px-2 py-1 rounded';
    }
};
</script>
