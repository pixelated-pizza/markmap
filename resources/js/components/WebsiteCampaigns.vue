<template>
  <div class="flex flex-col w-full h-full bg-gray-900 p-10 overflow-x-auto">
    <div
      class="items-center justify-between gap-2 p-4 bg-gray-800/80 backdrop-blur-md shadow-xl border border-gray-700 rounded-xl">
      <h2 class="text-md font-bold flex-1 text-white tracking-wide drop-shadow-lg">
        On-site Campaigns - Edisons and Mytopia
      </h2>
    </div>

    <div class="mt-3 bg-gray-900 rounded-lg p-3">
      <div class="mb-5 flex justify-between items-center">
        <Button type="button" icon="pi pi-plus" label="Add Campaign" size="small" severity="success" :loading="loading"
          @click="openAddModal" />
      </div>

      <FullCalendar ref="calendarRef" :options="calendarOptions" class="w-full" />

      <!-- ✅ Scrollable, with sticky header -->
      <div class="mt-5 h-[500px] overflow-y-auto rounded-lg">
        <DataTable :value="store.campaigns" dataKey="wc_id" scrollable scrollHeight="100%" tableStyle="min-width: 60rem"
          :loading="loading" class="p-datatable-sm" tableLayout="fixed">
          <template #header>
            <h3 class="text-lg font-semibold text-white text-center">On-site Campaigns</h3>
            <div class="table-header flex justify-end gap-2 items-center">
              
              <Button type="button" icon="pi pi-pencil" :label="isEditing ? 'Save Changes' : 'Edit Table'" size="small"
                severity="success" :loading="loading" @click="toggleEdit" />
                <Button type="button" icon="pi pi-times" label="Cancel" size="small"
                severity="danger" :loading="loading" @click="cancelEdit" v-if="isEditing"/>
            </div>
          </template>

          <Column field="name" header="Banner Name" class="w-1/4">
            <template #body="{ data }">
              <InputText v-if="isEditing" v-model="data.name" class="w-full"  @input="markAsModified(data.wc_id)"/>
              <span v-else>{{ data.name }}</span>
            </template>
          </Column>

          <Column field="start_date" header="Start Date" class="w-1/6">
            <template #body="{ data }">
              <Calendar v-if="isEditing" v-model="data.start_date" dateFormat="yy-mm-dd" showIcon class="w-full"  @input="markAsModified(data.wc_id)"/>
              <span v-else>{{ new Date(data.start_date).toLocaleDateString() }}</span>
            </template>
          </Column>

          <Column field="end_date" header="End Date" class="w-1/6">
            <template #body="{ data }">
              <Calendar v-if="isEditing" v-model="data.end_date" dateFormat="yy-mm-dd" showIcon class="w-full"  @input="markAsModified(data.wc_id)"/>
              <span v-else>{{ new Date(data.end_date).toLocaleDateString() }}</span>
            </template>
          </Column>

          <Column field="store_id" header="Website" class="w-1/6">
            <template #body="{ data }">
              <Select v-if="isEditing" v-model="data.store_id" :options="store.stores" optionLabel="store_name"
                optionValue="store_id" placeholder="Select Website" class="w-full"  @input="markAsModified(data.wc_id)"/>
              <span v-else>{{ data.store?.store_name }}</span>
            </template>
          </Column>

          <Column field="section_id" header="Section" class="w-1/6">
            <template #body="{ data }">
              <Select v-if="isEditing" v-model="data.section_id" :options="store.sections" optionLabel="name"
                optionValue="section_id" placeholder="Select Section" class="w-full"  @input="markAsModified(data.wc_id)"/>
              <span v-else>{{ data.section?.name }}</span>
            </template>
          </Column>

          <Column header="Status" class="w-1/6" v-if="!isEditing">
            <template #body="{ data }">
              <span :class="{
                'text-yellow-400': new Date(data.start_date) > new Date(),
                'text-green-400':
                  new Date(data.start_date) <= new Date() &&
                  new Date(data.end_date) >= new Date(),
                'text-gray-400': new Date(data.end_date) < new Date(),
              }">
                {{
                  new Date() < new Date(data.start_date) ? 'Upcoming' : new Date() > new Date(data.end_date)
                    ? 'Completed'
                    : 'Active'
                }}
              </span>
            </template>
          </Column>
          <Column header="Action" class="w-1/6" v-if="isEditing">
            <template #body="{ data }">
              <Button type="button" icon="pi pi-trash" label="Remove" size="small" severity="danger" :loading="loading"
                @click="deleteRow(data)" />
                <Button type="button" icon="pi pi-folder" label="Archive" size="small" severity="info" class="mt-5" :loading="loading"
                @click="archiveData(data)" />
            </template>
          </Column>

          <template #empty>
            <div class="p-4 text-center text-gray-400">No Data available.</div>
          </template>
        </DataTable>
      </div>


      <Dialog v-model:visible="showDialog" modal header="Campaign Details" :style="{ width: '30vw' }">
        <div class="flex flex-col gap-3">
          <div>
            <label class="block text-gray-300 mb-1">Name</label>
            <InputText v-model="form.name" class="w-full" placeholder="Name of the Banner?" />
          </div>

          <div>
            <label class="block text-gray-300 mb-1">Where do we place this?</label>
            <Select v-model="form.section_id" :options="store.sections" optionLabel="name" optionValue="section_id"
              class="w-full" placeholder="Section Name" />
          </div>

          <div>
            <label class="block text-gray-300 mb-1">What Website?</label>
            <Select v-model="form.store_id" :options="store.stores" optionLabel="store_name" optionValue="store_id"
              class="w-full" placeholder="Name of the website" />
          </div>

          <div>
            <label class="block text-gray-300 mb-1">Start Date</label>
            <DatePicker v-model="form.start_date" showIcon dateFormat="yy-mm-dd" class="w-full" />
          </div>

          <div>
            <label class="block text-gray-300 mb-1">End Date</label>
            <DatePicker v-model="form.end_date" showIcon dateFormat="yy-mm-dd" class="w-full" />
          </div>
        </div>

        <template #footer>
          <Button label="Cancel" severity="secondary" @click="showDialog = false" />
          <Button :label="Save" icon="pi pi-check" severity="success" @click="saveCampaign" />
        </template>
      </Dialog>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { getCurrentInstance } from "vue";
import FullCalendar from "@fullcalendar/vue3";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import Calendar from "primevue/calendar";
import { useOnsiteCampaignStore } from "@/stores/onsite_campaign_store.js";
import { DatePicker, Select } from "primevue";

const store = useOnsiteCampaignStore();


const toastr = getCurrentInstance().appContext.config.globalProperties.$toastr;

const calendarRef = ref(null);
const showDialog = ref(false);
const editMode = ref(false);
const loading = ref(false);
const isEditing = ref(false);
const modifiedCampaigns = ref (new Set());

const form = ref({
  name: "",
  section_id: "",
  store_id: "",
  start_date: "",
  end_date: "",
});

const calendarOptions = ref({
  schedulerLicenseKey: "GPL-My-Project-Is-Open-Source",
  plugins: [resourceTimelinePlugin, dayGridPlugin, interactionPlugin],
  initialView: "resourceTimelineMonth",
  headerToolbar: {
    left: "prev,next today",
    center: "title",
    right: "resourceTimelineMonth",
  },
  resourceAreaHeaderContent: "On-site Campaigns",
  resources: [],
  events: [],
  editable: true,
  selectable: true,
  height: "auto",

  // ✅ triggered when event bar is dragged to a new date
  eventDrop: async (info) => {
    const { id, start, end } = info.event;
    const campaign = store.campaigns.find((c) => String(c.wc_id) === id);
    if (!campaign) return;

    try {
      await store.editCampaign(id, {
        ...campaign,
        start_date: start ? start.toISOString().split("T")[0] : null,
        end_date: end ? end.toISOString().split("T")[0] : null,
      });

      toastr.success({
        severity: "success",
        summary: "Campaign Updated",
        detail: `${campaign.name} date updated.`,
        life: 2000,
      });

      // Update table + chart
      await store.loadCampaigns();
      updateCalendarResourcesAndEvents();
    } catch (error) {
      toastr.error("Failed to update campaign date.");
      info.revert(); // revert drag if error
    }
  },

  eventResize: async (info) => {
    const { id, start, end } = info.event;
    const campaign = store.campaigns.find((c) => String(c.wc_id) === id);
    if (!campaign) return;

    try {
      await store.editCampaign(id, {
        ...campaign,
        start_date: start ? start.toISOString().split("T")[0] : null,
        end_date: end ? end.toISOString().split("T")[0] : null,
      });

      toastr.success({
        severity: "success",
        summary: "Campaign Resized",
        detail: `${campaign.name} duration updated.`,
        life: 2000,
      });

      await store.loadCampaigns();
      updateCalendarResourcesAndEvents();
    } catch (error) {
      toastr.error("Failed to update campaign duration.");
      info.revert();
    }
  },
});


async function loadCampaigns() {
  loading.value = true;
  await store.loadCampaigns();
  await store.loadStores();
  await store.loadSections();
  updateCalendarResourcesAndEvents();
  loading.value = false;
}


function updateCalendarResourcesAndEvents() {
  const resources = store.stores.map(st => {
    const sections = store.sections
      .filter(sec => store.campaigns.some(
        c => String(c.store_id) === String(st.store_id) && String(c.section_id) === String(sec.section_id)
      ))
      .map(sec => ({
        id: `${String(st.store_id)}-${String(sec.section_id)}`,
        title: sec.name,
      }));

    return {
      id: `store-${String(st.store_id)}`,
      title: st.store_name,
      children: sections,
    };
  });

  const events = store.campaigns.map(c => ({
    id: String(c.wc_id),
    resourceId: `${String(c.store_id)}-${String(c.section_id)}`,
    title: c.name,
    start: c.start_date ? new Date(c.start_date).toISOString().split("T")[0] : null,
    end: c.end_date ? new Date(c.end_date).toISOString().split("T")[0] : null,
  }));

  calendarOptions.value = {
    ...calendarOptions.value,
    resources,
    events,
  };

  const calendarApi = calendarRef.value?.getApi();
  if (calendarApi) {
    calendarApi.addResource(resources);
    calendarApi.removeAllEvents();
    events.forEach(e => calendarApi.addEvent(e));
  }
}

function markAsModified(id) {
  modifiedCampaigns.value.add(id);
}

function openAddModal() {
  form.value = { id: null, name: "", section_id: "", store_id: "", start_date: "", end_date: "" };
  editMode.value = false;
  showDialog.value = true;
}

function openEditModal(campaign) {
  form.value = { ...campaign };
  editMode.value = true;
  showDialog.value = true;
}

const cancelEdit = async () => {
  isEditing.value = false;
  loading.value = true;
  await store.loadCampaigns();
  loading.value = false;
};

const toggleEdit = async () => {
  isEditing.value = !isEditing.value;

  if (!isEditing.value) {
    loading.value = true;
    try {
      for (const campaign of store.campaigns) {
        if (modifiedCampaigns.value.has(campaign.wc_id)) {
          await store.editCampaign(campaign.wc_id, {
            name: campaign.name,
            section_id: campaign.section_id,
            store_id: campaign.store_id,
            start_date: campaign.start_date
              ? new Date(campaign.start_date).toISOString().split("T")[0]
              : null,
            end_date: campaign.end_date
              ? new Date(campaign.end_date).toISOString().split("T")[0]
              : null,
          });
        }
      }

      await store.loadCampaigns();
      updateCalendarResourcesAndEvents();

      toastr.success({
        severity: "success",
        summary: "Saved",
        detail: `${modifiedCampaigns.value.size} campaign(s) updated.`,
        life: 3000,
      });

      modifiedCampaigns.value.clear();

    } catch (error) {
      toastr.error("❌ Error saving edited table data:", error);
    } finally {
      loading.value = false;
    }
  }
};


async function saveCampaign() {

  await store.addCampaign(form.value);
  showDialog.value = false;
  updateCalendarResourcesAndEvents();
}

onMounted(async () => {
  await loadCampaigns();
  await store.loadStores();
  await store.loadSections();
  await store.loadCampaigns();
  updateCalendarResourcesAndEvents();
});

</script>

<style scoped>
.fc {
  --fc-border-color: #374151;
  --fc-page-bg-color: #111827;
  --fc-neutral-bg-color: #1f2937;
  --fc-neutral-text-color: #d1d5db;
  --fc-button-bg-color: #374151;
  --fc-button-border-color: #4b5563;
  --fc-button-text-color: #f9fafb;
  --fc-button-hover-bg-color: #4b5563;
  --fc-today-bg-color: #1d4ed8;
  border-radius: 0.75rem;
  font-family: "Inter", sans-serif;
  color: #e5e7eb;
}

.fc-toolbar-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #f9fafb;
}

.fc-event {
  border-radius: 6px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.6);
  padding: 2px 4px;
}
</style>
