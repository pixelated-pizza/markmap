<template>
  <div class="card px-5 py-5">
    <div v-if="wsdStore.loading" class="text-gray-400 mb-3">Loading website sale details...</div>
    <div v-if="wsdStore.error" class="text-red-400 mb-3">{{ wsdStore.error }}</div>

    <DataTable
      :value="wsdStore.websiteSaleDetails"
      v-model:expandedRows="expandedRows"
      dataKey="campaign_id"
      showGridlines
      scrollable
      scrollDirection="horizontal"
      tableStyle="min-width: 100rem"
      size="small"
      class="text-sm"
      @rowExpand="onRowExpand"
      @rowCollapse="onRowCollapse"
    >
      <Column expander style="width: 3rem" header="Expand" />

      <Column header="Status">
        <template #body="{ data }">
          <span
            :class="{
              'text-green-400 font-semibold': isRunning(data),
              'text-red-400 font-semibold': isCompleted(data),
              'text-orange-400 font-semibold': isUpcoming(data),
            }"
          >
            {{ getStatus(data) }}
          </span>
        </template>
      </Column>

      <Column field="store_name" header="Channel" />
      <Column field="name" header="Event Name" />
      <Column field="start_date" header="Event Start Date [Execution Start Date]" />
      <Column field="end_date" header="Event End Date" />

      <template #expansion="{ data }">
        <div class="p-4 text-white">
          <h3 class="font-semibold text-lg mb-3">
            Website Sale Details for
            <span class="text-green-500">{{ data.name }}</span> ({{ data.store_name }})
          </h3>

          <!-- Editable table -->
          <table class="min-w-full border border-gray-700 rounded-lg text-sm">
            <tbody>
              <tr class="border-b border-gray-700">
                <td class="font-semibold py-2 px-3">Products to be included in featured category</td>
                <td class="py-2 px-3">
                  <InputText
                    v-model="data.featured_products"
                    v-if="data.isEditing"
                    class="w-full"
                  />
                  <span v-else>{{ replacer(data.featured_products) }}</span>
                </td>
              </tr>

              <tr class="border-b border-gray-700 bg-gray-900/50">
                <td class="font-semibold py-2 px-3">Sale Title in Home Page</td>
                <td class="py-2 px-3">
                  <InputText
                    v-model="data.sale_title"
                    v-if="data.isEditing"
                    class="w-full"
                  />
                  <span v-else>{{ replacer(data.sale_title) }}</span>
                </td>
              </tr>

              <tr class="border-b border-gray-700 bg-gray-900/50">
                <td class="font-semibold py-2 px-3">T&amp;C's</td>
                <td class="py-2 px-3">
                  <Textarea
                    v-model="data.terms_conditions"
                    v-if="data.isEditing"
                    rows="3"
                    class="w-full"
                  />
                  <span v-else>{{ replacer(data.terms_conditions) }}</span>
                </td>
              </tr>

              <tr class="border-b border-gray-700">
                <td class="font-semibold py-2 px-3">Mock Up &amp; Banner Locations</td>
                <td class="py-2 px-3">
                  <Textarea
                    v-model="data.mockup_locations"
                    v-if="data.isEditing"
                    rows="3"
                    class="w-full"
                  />
                  <span v-else>{{ replacer(data.mockup_locations) }}</span>
                </td>
              </tr>

              <tr class="border-b border-gray-700 bg-gray-900/50">
                <td class="font-semibold py-2 px-3">SKU feature in creative (Main banner)</td>
                <td class="py-2 px-3">
                  <InputText
                    v-model="data.sku_in_main_banner"
                    v-if="data.isEditing"
                    class="w-full"
                  />
                  <span v-else>{{ replacer(data.sku_in_main_banner) }}</span>
                </td>
              </tr>

              <tr class="border-b border-gray-700">
                <td class="font-semibold py-2 px-3">Event Master Sheet</td>
                <td class="py-2 px-3">
                  <InputText
                    v-model="data.event_master_sheet"
                    v-if="data.isEditing"
                    class="w-full"
                  />
                  <a v-else :href="data.event_master_sheet" target="_blank">
                    {{ replacer(data.event_master_sheet) }}
                  </a>
                </td>
              </tr>

              <tr class="border-b border-gray-700 bg-gray-900/50">
                <td class="font-semibold py-2 px-3">SKU List to Feature Provided</td>
                <td class="py-2 px-3">
                  <InputText
                    v-model="data.sku_list_provided"
                    v-if="data.isEditing"
                    class="w-full"
                  />
                  <span v-else>{{ replacer(data.sku_list_provided) }}</span>
                </td>
              </tr>

              <tr class="border-b border-gray-700">
                <td class="font-semibold py-2 px-3">Website Sale Execution - Run Sheet</td>
                <td class="py-2 px-3">
                  <InputText
                    v-model="data.run_sheet"
                    v-if="data.isEditing"
                    class="w-full"
                  />
                  <a v-else :href="data.run_sheet" target="_blank">
                    {{ replacer(data.run_sheet) }}
                  </a>
                </td>
              </tr>

              <tr class="border-b border-gray-700 bg-gray-900/50">
                <td class="font-semibold py-2 px-3">ESS to Execute</td>
                <td class="py-2 px-3">
                  <InputText v-model="data.ess" v-if="data.isEditing" class="w-full" />
                  <span v-else>{{ replacer(data.ess) }}</span>
                </td>
              </tr>

              <tr>
                <td class="font-semibold py-2 px-3">CMS to Audit</td>
                <td class="py-2 px-3">
                  <InputText v-model="data.cms_to_audit" v-if="data.isEditing" class="w-full" />
                  <span v-else>{{ replacer(data.cms_to_audit) }}</span>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Text Table (read-only for now) -->
          <DataTable
            :value="buildTextTable(data)"
            showGridlines
            size="small"
            class="text-sm mb-5"
            tableStyle="min-width: 60rem"
          >
            <Column field="featured_banner_text" header="Featured Category Banners Text" />
            <Column field="sku_in_category_creative" header="SKU feature in Category creative" />
            <Column field="url_text" header="URL Text in Landing Page Link" />
          </DataTable>

          <!-- Buttons -->
          <div class="mt-4 text-right space-x-2">
            <Button
              v-if="!data.isEditing"
              label="Edit Details"
              icon="pi pi-pencil"
              class="p-button-sm p-button-outlined"
              @click="data.isEditing = true"
            />
            <Button
              v-else
              label="Save"
              icon="pi pi-save"
              class="p-button-sm p-button-success"
              @click="saveChanges(data)"
            />
            <Button
              v-if="data.isEditing"
              label="Cancel"
              icon="pi pi-times"
              class="p-button-sm p-button-secondary"
              @click="cancelEdit(data)"
            />
          </div>
        </div>
      </template>
    </DataTable>
  </div>
</template>

<script setup>
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import { ref, onMounted } from "vue";
import { useWSDStore } from "@/stores/wsd_store";

const expandedRows = ref(null);
const wsdStore = useWSDStore();

const replacer = (val) =>
  val === null || val === undefined || val === "" ? "No Data Yet" : val;

const isRunning = (data) => {
  const today = new Date();
  const start = new Date(data.start_date);
  const end = new Date(data.end_date);
  return today >= start && today <= end;
};
const isCompleted = (data) => new Date() > new Date(data.end_date);
const isUpcoming = (data) => new Date() < new Date(data.start_date);
const getStatus = (data) => (isRunning(data) ? "RUNNING" : isCompleted(data) ? "ENDED" : "UPCOMING");

const isList = (text) => typeof text === "string" && text.includes("\n");
const splitList = (text) => text.split("\n").map((line) => line.trim()).filter(Boolean);

const buildTextTable = (data) => {
  const banners = isList(data.featured_banner_text) ? splitList(data.featured_banner_text) : [replacer(data.featured_banner_text)];
  const skus = isList(data.sku_in_category_creative) ? splitList(data.sku_in_category_creative) : [replacer(data.sku_in_category_creative)];
  const urls = isList(data.url_text) ? splitList(data.url_text) : [replacer(data.url_text)];
  const maxLen = Math.max(banners.length, skus.length, urls.length);
  return Array.from({ length: maxLen }, (_, i) => ({
    featured_banner_text: banners[i] || "No Data Yet",
    sku_in_category_creative: skus[i] || "No Data Yet",
    url_text: urls[i] || "No Data Yet",
  }));
};

const onRowExpand = (event) => (expandedRows.value = { [event.data.campaign_id]: true });
const onRowCollapse = () => (expandedRows.value = null);

const saveChanges = async (data) => {
  try {
    const payload = {
      wc_id: data.wc_id,
      terms_conditions: data.terms_conditions,
      mockup_banner_locations: data.mockup_locations,
      event_master_sheet_url: data.event_master_sheet,
      run_sheet_url: data.run_sheet,
      ess: data.ess,
      cms_to_audit: data.cms_to_audit,
    };
    await wsdStore.editWSD(data.wsd_id, payload);
    data.isEditing = false;
  } catch (err) {
    console.error("Save failed:", err);
  }
};

const cancelEdit = (data) => {
  data.isEditing = false;
  wsdStore.loadWSD();
};

onMounted(async () => {
  await wsdStore.loadWSD();
});
</script>
