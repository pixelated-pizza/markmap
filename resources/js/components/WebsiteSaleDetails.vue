<template>
  <div class="card">
    <h4 class=" font-semibold text-lg text-center p-2 app-dark:text-white">
      Website Sale Details
    </h4>
    <template v-if="loading">
      <div class="flex flex-col gap-4 w-full h-full">
        <p class="text-gray-400 text-lg">Loading Data Table...</p>
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

    <div v-else class="dark:bg-gray-800 bg-white p-2">
      <div class="mb-2 flex justify-content-between flex-wrap gap-4 w-full">

        <div class="flex items-center w-full md:w-auto">
          <IconField>
            <InputIcon>
              <i class="pi pi-search" />
            </InputIcon>
            <InputText placeholder="Search website sale" v-model="searchQuery" />
          </IconField>
        </div>
        <div class="flex items-center gap-2">
          <label for="campaignFilter" class="text-black dark:text-white select-none mr-2">Filter Campaigns:</label>
          <Select v-model="campaignFilter" inputId="campaignFilter" class="w-48" :options="[
            { label: 'All', value: 'ALL' },
            { label: 'Running', value: 'RUNNING' },
            { label: 'Ended', value: 'ENDED' }
          ]" optionLabel="label" optionValue="value" />
        </div>
      </div>
      <DataTable :value="filteredCampaigns" v-model:expandedRows="expandedRows" dataKey="campaign_id" showGridlines
        scrollable scrollDirection="horizontal" tableStyle="min-width: 100rem;" size="small" class="text-md bg-gray-900"
        @rowExpand="onRowExpand" @rowCollapse="onRowCollapse" paginator :rows="15">
        <Column expander style="width: 3rem" header="Expand" />

        <Column header="Status" sortable sortField="statusOrder">
          <template #body="{ data }">
            <span :class="{
              'text-green-400 font-semibold': isRunning(data),
              'text-red-400 font-semibold': isCompleted(data),
              'text-orange-400 font-semibold': isUpcoming(data),
            }">
              {{ getStatus(data) }}
            </span>
          </template>
        </Column>

        <Column field="store_name" header="Channel" />
        <Column field="name" header="Event Name" />
        <Column field="start_date" header="Event Start Date">
          <template #body="{ data }">
            {{ formatDate(data.start_date) }}
          </template>
        </Column>

        <Column field="end_date" header="Event End Date">
          <template #body="{ data }">
            {{ formatDate(data.end_date) }}
          </template>
        </Column>

        <template #expansion="{ data }">
          <Transition enter-active-class="expand-enter-active" leave-active-class="expand-leave-active"
            enter-from-class="expand-enter-from" enter-to-class="expand-enter-to" leave-from-class="expand-leave-from"
            leave-to-class="expand-leave-to">
            <div class="p-4 text-black dark:text-gray-300 border border-gray-300 dark:border-gray-600">
              <h4 class="font-semibold text-lg mb-3 text-center text-black dark:text-white">
                Website Sale Details for
                <span class="text-green-500">{{ data.name }}</span> ({{ data.store_name }})
              </h4>
              <DataTable v-if="editingCampaign && editingCampaign.wsd_id === data.wsd_id" :value="editableTextTable"
                showGridlines size="small" class="text-sm mb-5 mt-5" tableStyle="min-width: 60rem">
                <Column field="featured_banner_text" header="Featured Category Banners Text">
                  <template #body="{ data: row }">
                    <Textarea v-model="row.featured_banner_text" class="w-full" rows="3" autoResize />
                  </template>
                </Column>

                <Column field="sku_in_category_creative" header="SKU Feature in Category Creative">
                  <template #body="{ data: row }">
                    <Textarea v-model="row.sku_in_category_creative" class="w-full" rows="3" autoResize />
                  </template>
                </Column>

                <Column field="url_text" header="URL Text in Landing Page Link">
                  <template #body="{ data: row }">
                    <Textarea v-model="row.url_text" class="w-full" rows="3" autoResize />
                  </template>
                </Column>
              </DataTable>

              <DataTable v-else :value="editableTextTable" showGridlines size="small"
                class="text-sm mb-5 mt-5 text-black dark:text-gray-200" tableStyle="min-width: 60rem">
                <Column field="featured_banner_text" header="Featured Category Banners Text">
                  <template #body="{ data: row }">
                    <span v-html="autoLink(row.featured_banner_text)"></span>
                  </template>
                </Column>

                <Column field="sku_in_category_creative" header="SKU Feature in Category Creative">
                  <template #body="{ data: row }">
                    <span v-html="formatMultiline(row.sku_in_category_creative)"></span>
                  </template>
                </Column>

                <Column field="url_text" header="URL Text in Landing Page Link">
                  <template #body="{ data: row }">
                    <span v-html="formatMultiline(row.url_text)"></span>
                  </template>
                </Column>
              </DataTable>

              <table class="min-w-full rounded-lg text-md">
                <tbody>
                  <tr v-for="(field, i) in fieldsList" :key="field.key" :class="[
                    'border border-gray-300 dark:border-gray-800',
                    i % 2 === 1 ? 'bg-gray-100 dark:bg-gray-900/50' : ''
                  ]">

                    <td class="font-semibold text-md py-2 px-3 w-1/3 text-black dark:text-gray-200">{{ field.label }}
                    </td>
                    <td class="py-2 px-3">
                      <template v-if="data.isEditing">
                        <template v-if="field.key === 'terms_conditions'">
                          <span class="text-gray-600 dark:text-gray-400 cursor-not-allowed">
                            {{ data[field.key] || "T&C's are auto generated" }}
                          </span>
                        </template>
                        <template v-else-if="field.key === 'is_sku_list_to_feature'">
                          <Select v-model="data[field.key]" :options="[
                            { label: 'Yes', value: 1 },
                            { label: 'No', value: 0 }
                          ]" optionLabel="label" optionValue="value" class="w-full" />
                        </template>
                        <template v-else>
                          <Textarea v-model="data[field.key]" class="w-full" rows="2" />
                        </template>
                      </template>
                      <span class="text-black dark:text-gray-200">
                        <template
                          v-if="['event_master_sheet', 'run_sheet', 'featured_products_sheet_url'].includes(field.key) && data[field.key]">
                          <a :href="data[field.key]" target="_blank" :class="field.key === 'event_master_sheet'
                            ? 'text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-500'
                            : 'text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-500'">
                            {{ replacer(data[field.key]) }}
                          </a>
                        </template>
                        <template v-else-if="field.key === 'is_sku_list_to_feature'">
                          {{ data[field.key] == 1 || data[field.key] === true ? "Yes" : "No" }}
                        </template>

                        <template v-else-if="field.key === 'terms_conditions'">
                          {{ data[field.key] || "T&C's are auto generated" }}
                        </template>

                        <template v-else>
                          {{ replacer(data[field.key]) }}
                        </template>
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>

              <div class="mt-4 text-center space-x-2 mb-4">
                <Button v-if="!data.isEditing" label="Edit Details" icon="pi pi-pencil" class="p-button-sm"
                  severity="contrast" @click="enableEditing(data)" />
                <Button v-else label="Save" icon="pi pi-save" class="p-button-sm" severity="contrast"
                  @click="() => saveChanges(data)" />
                <Button v-if="data.isEditing" label="Cancel" icon="pi pi-times" class="p-button-sm p-button-secondary"
                  @click="() => cancelEdit(data)" />
                <Button v-if="isCompleted(data)" label="Re-run Campaign" icon="pi pi-refresh"
                  class="p-button-sm p-button-contrast" @click="() => openRerunModal(data)" />
              </div>

            </div>
          </Transition>
        </template>
      </DataTable>
    </div>
    <Dialog v-model:visible="rerunModalVisible" header="Re-run Campaign" :modal="true" :closable="true" class="w-96">
      <div class="flex flex-col gap-3">
        <label class="font-semibold">New Start Date</label>
        <InputText type="date" v-model="newStartDate" class="w-full" />

        <label class="font-semibold">New End Date</label>
        <InputText type="date" v-model="newEndDate" class="w-full" />

        <div class="mt-4 flex justify-end gap-2">
          <Button label="Cancel" icon="pi pi-times" class="p-button-secondary"
            @click="() => rerunModalVisible = false" />
          <Button label="Submit" icon="pi pi-check" class="p-button-success" @click="submitRerunCampaign" />
        </div>
      </div>
    </Dialog>
  </div>
</template>
<script setup>
import { reactive, ref, onMounted, computed } from "vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import Textarea from "primevue/textarea";
import Select from "primevue/select";
import Skeleton from "primevue/skeleton";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import { useWSDStore } from "@/js/stores/wsd_store";
import { useOnsiteCampaignStore } from '@/js/stores/onsite_campaign_store.js';
import { getCurrentInstance } from "vue";

const store = useOnsiteCampaignStore();

const rerunModalVisible = ref(false);
const rerunCampaignData = ref(null);
const newStartDate = ref('');
const newEndDate = ref('');


const toastr = getCurrentInstance().appContext.config.globalProperties.$toastr;

const campaignFilter = ref("ALL");

const expandedRows = ref(null);
const wsdStore = useWSDStore();
const editableTextTable = reactive([]);
const searchQuery = ref("");
const loading = ref(false);

const editingCampaign = ref(null);

const fieldsList = [
  { key: "featured_products_sheet_url", label: "Products to be included in featured category (URL of the sheet)" },
  { key: "run_sheet", label: "Website Sale Execution - Run Sheet" },
  { key: "event_master_sheet", label: "Event Master Sheet" },
  { key: "ess", label: "ESS to Execute" },
  { key: "cms_to_audit", label: "CMS to Audit" },
  { key: "terms_conditions", label: "T&C's" },
  { key: "mockup_banner_locations", label: "Mock Up & Banner Locations" },
  { key: "is_sku_list_to_feature", label: "SKU List to Feature Provided?" },
];
const replacer = (val) => (val == null || val === "" ? "No Data Yet" : val);

const todayStr = new Date().toISOString().split("T")[0];
const isRunning = (data) => todayStr >= data.start_date && todayStr <= data.end_date;
const isCompleted = (data) => todayStr > data.end_date;
const isUpcoming = (data) => todayStr < data.start_date;
const getStatus = (data) => (isRunning(data) ? "RUNNING" : isCompleted(data) ? "ENDED" : "UPCOMING");

const buildTextTable = (data) => [
  {
    featured_banner_text: data.featured_banner_text || "",
    sku_in_category_creative: data.sku_in_category_creative || "",
    url_text: data.url_text || "",
  },
];


const onRowExpand = (event) => {
  const currentCampaign = event.data;
  expandedRows.value = { [currentCampaign.campaign_id]: true };

  fieldsList.forEach((field) => {
    if (!(field.key in currentCampaign)) currentCampaign[field.key] = "";
  });

  currentCampaign.featured_banner_text = currentCampaign.featured_banner_text ?? "";
  currentCampaign.sku_in_category_creative = currentCampaign.sku_in_category_creative ?? "";
  currentCampaign.url_text = currentCampaign.url_text ?? "";

  const table = buildTextTable(currentCampaign);
  editableTextTable.splice(0, editableTextTable.length, ...table);
};

const onRowCollapse = () => (expandedRows.value = null);

const enableEditing = (campaign) => {
  campaign.isEditing = true;
  editingCampaign.value = campaign;
};

const formatMultiline = (text) => {
  if (!text) return "No Data Yet";
  return text.replace(/\n/g, "<br>");
};

function formatDate(date) {
  if (!date) return "";

  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

const filteredCampaigns = computed(() => {
  let campaigns = [...wsdStore.websiteSaleDetails];

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    campaigns = campaigns.filter(c =>
      c.name?.toLowerCase().includes(q) ||
      c.store_name?.toLowerCase().includes(q) ||
      String(c.start_date).toLowerCase().includes(q) ||
      String(c.end_date).toLowerCase().includes(q)
    );
  }

  if (campaignFilter.value === "RUNNING") {
    campaigns = campaigns.filter(c => isRunning(c));
  } else if (campaignFilter.value === "ENDED") {
    campaigns = campaigns.filter(c => isCompleted(c));
  }

  campaigns.sort((a, b) => new Date(b.start_date) - new Date(a.start_date));

  return campaigns;
});



const saveChanges = async (data) => {
  try {
    data.featured_banner_text = editableTextTable[0].featured_banner_text;
    data.sku_in_category_creative = editableTextTable[0].sku_in_category_creative;
    data.url_text = editableTextTable[0].url_text;

    const payload = {
      wc_id: data.wc_id ?? data.campaign_id,
      terms_conditions: data.terms_conditions,
      featured_products_sheet_url: data.featured_products_sheet_url,
      mockup_banner_locations: data.mockup_banner_locations,
      event_master_sheet_url: data.event_master_sheet,
      run_sheet_url: data.run_sheet,
      is_sku_list_to_feature: data.is_sku_list_to_feature,
      ess: data.ess,
      cms_to_audit: data.cms_to_audit,
      featured_banner_text: data.featured_banner_text,
      sku_in_category_creative: data.sku_in_category_creative,
      url_text: data.url_text,
    };

    await wsdStore.addWSD(payload);

    toastr.success("Details saved successfully.");
    data.isEditing = false;
    editingCampaign.value = null;
    await wsdStore.loadWSD();
    wsdStore.websiteSaleDetails =
      addStatusFields(wsdStore.websiteSaleDetails);

  } catch (err) {
    if (err.response?.status === 422 && err.response.data?.errors) {
      const errors = err.response.data.errors;

      Object.entries(errors).forEach(([field, messages]) => {
        toastr.error(messages[0], `Error in ${field.replace(/_/g, " ")}`);
      });

    } else {
      console.error("Save failed:", err);
      toastr.error("An error occurred while saving.");
    }
  }
};


const addStatusFields = (list) => {
  const today = new Date().toISOString().split("T")[0];

  return list.map(c => {
    let status = "UPCOMING";

    if (today >= c.start_date && today <= c.end_date) status = "RUNNING";
    else if (today > c.end_date) status = "ENDED";

    return {
      ...c,
      status,
      statusOrder: {
        RUNNING: 1,
        UPCOMING: 2,
        ENDED: 3
      }[status]
    };
  });
};


const cancelEdit = (data) => {
  data.isEditing = false;
  editingCampaign.value = null;
  const restored = buildTextTable(data);
  editableTextTable.splice(0, editableTextTable.length, ...restored);
  wsdStore.loadWSD().then(() => {
    wsdStore.websiteSaleDetails =
      addStatusFields(wsdStore.websiteSaleDetails);
  });
};

const autoLink = (text) => {
  if (!text) return "No Data Yet";

  const urlRegex = /(https?:\/\/[^\s)<>"']+)/g;

  return text
    .replace(/\n/g, "<br>")
    .replace(urlRegex, (url) => {
      return `<a href="${url}" target="_blank" class="text-blue-400 underline">${url}</a>`;
    });
};

//for rerun campaign
const openRerunModal = (campaign) => {
  rerunCampaignData.value = campaign;
  newStartDate.value = campaign.start_date; // prefill old dates if needed
  newEndDate.value = campaign.end_date;
  rerunModalVisible.value = true;
};

const submitRerunCampaign = async () => {
  if (!newStartDate.value || !newEndDate.value) {
    toastr.error("Please select both start and end dates.");
    return;
  }

  if (newEndDate.value < newStartDate.value) {
    toastr.error("End date cannot be before start date.");
    return;
  }

  try {
    const payload = {
      wc_id: rerunCampaignData.value.campaign_id,
      name: rerunCampaignData.value.name,
      start_date: newStartDate.value,
      end_date: newEndDate.value,
    };

    await store.editCampaign(rerunCampaignData.value.campaign_id, payload);

    await wsdStore.loadWSD();

    toastr.success({
      severity: "success",
      summary: "Campaign Re-run Scheduled",
      detail: "Campaign has been successfully re-run.",
      life: 2000
    });

    rerunModalVisible.value = false;
    rerunCampaignData.value = null;

    await store.loadCampaigns();
    updateCalendarResourcesAndEvents();

  } catch (error) {
    console.error(error);
    toastr.error("Failed to re-run campaign.");
  }
};



onMounted(async () => {
  loading.value = true;
  await wsdStore.loadWSD();

  wsdStore.websiteSaleDetails =
    addStatusFields(wsdStore.websiteSaleDetails);

  loading.value = false;
});

</script>

<style scoped>
td.py-2 {
  min-height: 2.5rem;
}

td.py-2 textarea,
td.py-2 input {
  height: 100%;
}
</style>
