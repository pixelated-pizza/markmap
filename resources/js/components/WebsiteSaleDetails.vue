<template>
  <div class="card px-5 py-5">
    <DataTable :value="website_sale_details" v-model:expandedRows="expandedRows" dataKey="id" showGridlines scrollable
      scrollDirection="horizontal" tableStyle="min-width: 100rem" :size="'small'" class="text-sm" expandableRows>

      <Column expander style="width: 3rem" header="Expand" />

      <Column field="code" header="Status" />
      <Column field="store_name" header="Channel" />
      <Column field="campaign_name" header="Event Name" />
      <Column field="start_date" header="Event Start Date [Execution Start Date]" />
      <Column field="end_date" header="Event End Date" />

      <template #expansion="{ data }">
        <div class="p-4 text-white">
          <h3 class="font-semibold text-lg mb-3">Website Sale Details</h3>

          <table class="min-w-full border border-gray-700 rounded-lg text-sm">
            <tbody>
              <tr class="border-b border-gray-700">
                <td class="font-semibold py-2 px-3 w-1/3">Featured Category Banners Text</td>
                <td class="py-2 px-3">
                  <div v-if="isList(data.featured_banner_text)">
                    <ol class="list-decimal list-inside space-y-1">
                      <li v-for="(line, i) in splitList(data.featured_banner_text)" :key="i">{{ line }}</li>
                    </ol>
                  </div>
                  <div v-else>{{ data.featured_banner_text }}</div>
                </td>
              </tr>

              <tr class="border-b border-gray-700 bg-gray-900/50">
                <td class="font-semibold py-2 px-3">SKU feature in Category creative</td>
                <td class="py-2 px-3">
                  <div v-if="isList(data.sku_in_category_creative)">
                    <ol class="list-decimal list-inside space-y-1">
                      <li v-for="(line, i) in splitList(data.sku_in_category_creative)" :key="i">{{ line }}</li>
                    </ol>
                  </div>
                  <div v-else>{{ data.sku_in_category_creative }}</div>
                </td>
              </tr>

              <tr class="border-b border-gray-700">
                <td class="font-semibold py-2 px-3">Products to be included in featured category</td>
                <td class="py-2 px-3">{{ data.featured_products }}</td>
              </tr>

              <tr class="border-b border-gray-700 bg-gray-900/50">
                <td class="font-semibold py-2 px-3">Sale Title in Home Page</td>
                <td class="py-2 px-3">{{ data.sale_title }}</td>
              </tr>

              <tr class="border-b border-gray-700">
                <td class="font-semibold py-2 px-3">URL Text in Landing Page Link</td>
                <td class="py-2 px-3">
                  <div v-if="isList(data.url_text)">
                    <ol class="list-decimal list-inside space-y-1">
                      <li v-for="(line, i) in splitList(data.url_text)" :key="i">{{ line }}</li>
                    </ol>
                  </div>
                  <div v-else>{{ data.url_text }}</div>
                </td>
              </tr>

              <tr class="border-b border-gray-700 bg-gray-900/50">
                <td class="font-semibold py-2 px-3">T&amp;C's</td>
                <td class="py-2 px-3">{{ data.terms_conditions }}</td>
              </tr>
              <tr class="border-b border-gray-700">
                <td class="font-semibold py-2 px-3">Mock Up &amp; Banner Locations</td>
                <td class="py-2 px-3">{{ data.mockup_locations }}</td>
              </tr>
              <tr class="border-b border-gray-700 bg-gray-900/50">
                <td class="font-semibold py-2 px-3">SKU feature in creative (Main banner)</td>
                <td class="py-2 px-3">{{ data.sku_in_main_banner }}</td>
              </tr>
              <tr class="border-b border-gray-700">
                <td class="font-semibold py-2 px-3">Event Master Sheet</td>
                <td class="py-2 px-3"><a :href="data.event_master_sheet" target="_blank">{{ data.event_master_sheet }}</a></td>
              </tr>
              <tr class="border-b border-gray-700 bg-gray-900/50">
                <td class="font-semibold py-2 px-3">SKU List to Feature Provided</td>
                <td class="py-2 px-3">{{ data.sku_list_provided }}</td>
              </tr>
              <tr class="border-b border-gray-700">
                <td class="font-semibold py-2 px-3">Website Sale Execution - Run Sheet</td>
                <td class="py-2 px-3"><a :href="data.run_sheet" target="_blank">{{ data.run_sheet }}</a></td>
              </tr>
              <tr class="border-b border-gray-700 bg-gray-900/50">
                <td class="font-semibold py-2 px-3">ESS to Execute</td>
                <td class="py-2 px-3">{{ data.ess }}</td>
              </tr>
              <tr>
                <td class="font-semibold py-2 px-3">CMS to Audit</td>
                <td class="py-2 px-3">{{ data.cms_to_audit }}</td>
              </tr>
            </tbody>
          </table>

          <div class="mt-4 text-right">
            <Button label="Edit Details" icon="pi pi-pencil" class="p-button-sm p-button-outlined" />
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
import { ref } from "vue";

const expandedRows = ref([]);

const isList = (text) => typeof text === 'string' && text.includes('\n');
const splitList = (text) => text.split('\n').map((line) => line.trim()).filter((line) => line.length > 0);


const website_sale_details = ref([
  {
    id: 1,
    code: "Active",
    store_name: "Edisons",
    campaign_name: "Inventory Blowout Sale",
    start_date: "2025-10-21",
    end_date: "2025-11-04",
    featured_banner_text: "",
    sku_in_category_creative: "Yes",
    featured_products: "Generators, Heaters",
    sale_title: "Winter Warmers",
    url_text: "shop-now",
    terms_conditions: "Valid until stocks last.",
    mockup_locations: "Homepage, Category Banner",
    sku_in_main_banner: "GEN123, HEAT456",
    event_master_sheet: "https://docs.google.com/spreadsheets/d/1O-un8GZlnxOakHlGA4-BJuK7Gsx2jDaUdPeXgyq1RgM/edit?gid=820302021#gid=820302021",
    sku_list_provided: "Yes",
    run_sheet: "https://docs.google.com/spreadsheets/d/1YLV2jzmWohm5drlYdzq4CysHsPcf0qJ5VU1-8rKEOfM/edit?gid=121305424#gid=121305424",
    ess: "Tonni & Ralph",
    cms_to_audit: "Donna & Roger",
  },
  {
    id: 2,
    code: "Active",
    store_name: "Mytopia",
    campaign_name: "Inventory Blowout Sale",
    start_date: "2025-10-21",
    end_date: "2025-11-04",
    featured_banner_text: "",
    sku_in_category_creative: "Yes",
    featured_products: "Generators, Heaters",
    sale_title: "Winter Warmers",
    url_text: "shop-now",
    terms_conditions: "Valid until stocks last.",
    mockup_locations: "Homepage, Category Banner",
    sku_in_main_banner: "GEN123, HEAT456",
    event_master_sheet: "https://docs.google.com/spreadsheets/d/1O-un8GZlnxOakHlGA4-BJuK7Gsx2jDaUdPeXgyq1RgM/edit?gid=820302021#gid=820302021",
    sku_list_provided: "Yes",
    run_sheet: "https://docs.google.com/spreadsheets/d/1YLV2jzmWohm5drlYdzq4CysHsPcf0qJ5VU1-8rKEOfM/edit?gid=121305424#gid=121305424",
    ess: "Tonni & Ralph",
    cms_to_audit: "Donna & Roger",
  },
]);
</script>

<style scoped></style>
