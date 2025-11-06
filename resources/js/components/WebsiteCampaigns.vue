<template>
  <div class="flex flex-col w-full h-full bg-gray-900 px-6 overflow-x-auto">

    <div class="bg-gray-900 rounded-lg p-3 mt-2">

      <div class="h-[450px] overflow-hidden rounded-lg bg-black p-5 mb-5 rounded-md">
        <template v-if="loading">
          <div class="flex flex-col gap-4 w-full h-full">
            <p class="text-gray-400 text-lg">Loading Gantt Chart...</p>
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

        <FullCalendar v-else ref="calendarRef" :options="calendarOptions" class="w-full h-full" />
      </div>

      <div class="mb-5 rounded-sm">
        <template v-if="loading">
          <div class="flex flex-col gap-4 w-full h-full bg-black p-5 rounded-md">
            <p class="text-gray-400 text-lg">Loading data table...</p>
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
        <DataTable v-else :value="store.campaigns" dataKey="wc_id" paginator :rows="5"
          :rowsPerPageOptions="[5, 10, 20, 50]" showGridlines scrollable scrollHeight="500px" stickyHeader
          tableStyle="min-width: 60rem;" :loading="loading" class="p-datatable-sm" tableLayout="fixed">
          <template #header>
            <div class="table-header flex justify-start gap-2 items-center p-2">

              <Button type="button" icon="pi pi-plus" label="Add Campaign" size="small" severity="success"
                :loading="loading" @click="openAddModal" v-if="!isEditing" />

              <Button type="button" icon="pi pi-pencil" :label="isEditing ? 'Save Changes' : 'Edit Table'" size="small"
                severity="success" :loading="loading" @click="toggleEdit" />
              <Button type="button" icon="pi pi-times" label="Close" size="small" severity="danger" :loading="loading"
                @click="cancelEdit" v-if="isEditing" />
            </div>
          </template>

          <Column field="name" header="Banner Name" class="w-1/4">
            <template #body="{ data }">
              <InputText v-if="isEditing" v-model="data.name" class="w-full" @input="markAsModified(data.wc_id)" />
              <span v-else>{{ data.name }}</span>
            </template>
          </Column>

          <Column field="start_date" header="Start Date" class="w-1/6">
            <template #body="{ data }">
              <Calendar v-if="isEditing" v-model="data.start_date" dateFormat="yy-mm-dd" showIcon class="w-full"
                @update:modelValue="markAsModified(data.wc_id)" />
              <span v-else>{{ new Date(data.start_date).toLocaleDateString('en-GB') }}</span>
            </template>
          </Column>

          <Column field="end_date" header="End Date" class="w-1/6">
            <template #body="{ data }">
              <Calendar v-if="isEditing" v-model="data.end_date" dateFormat="yy-mm-dd" showIcon class="w-full"
                @update:modelValue="markAsModified(data.wc_id)" />
              <span v-else>{{ new Date(data.end_date).toLocaleDateString('en-GB') }}</span>
            </template>
          </Column>

          <Column field="store_id" header="Website" class="w-1/6">
            <template #body="{ data }">
              <Select v-if="isEditing" v-model="data.store_id" :options="store.stores" optionLabel="store_name"
                optionValue="store_id" placeholder="Select Website" class="w-full"
                @update:modelValue="markAsModified(data.wc_id)" />
              <span v-else>{{ data.store?.store_name }}</span>
            </template>
          </Column>

          <Column field="section_id" header="Section" class="w-1/6">
            <template #body="{ data }">
              <Select v-if="isEditing" v-model="data.section_id" :options="store.sections" optionLabel="name"
                optionValue="section_id" placeholder="Select Section" class="w-full"
                @update:modelValue="markAsModified(data.wc_id)" />
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
              <div class="flex flex-col gap-2">
                <Button type="button" icon="pi pi-folder" label="Archive" size="small" severity="info"
                  :loading="loading" @click="confirmArchive(data)" />
                <Button type="button" icon="pi pi-trash" label="Delete" size="small" severity="danger"
                  :loading="loading" @click="confirmDelete(data)" />
              </div>
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
            <label class="block text-gray-300 mb-1">Campaign Category</label>
            <Select v-model="form.campaign_type_id" :options="store.campaign_types" optionLabel="campaign_type_name"
              optionValue="campaign_type_id" class="w-full" placeholder="Campaign Category" />
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

      <Dialog v-model:visible="showArchiveDialog" header="Confirm Archive" :modal="true" :closable="false"
        :style="{ width: '400px' }">
        <p>Are you sure you want to archive the campaign "{{ campaignToArchive?.name }}"?</p>

        <template #footer>
          <Button label="No" severity="danger" text @click="showArchiveDialog = false" />
          <Button label="Yes" severity="success" @click="archiveConfirmed" />
        </template>
      </Dialog>

      <Dialog v-model:visible="showDeleteDialog" header="Delete Campaign" :modal="true" :closable="false"
        :style="{ width: '400px' }">
        <p>Are you sure you want to delete the campaign "{{ campaignToDelete?.name }}"?</p>

        <template #footer>
          <Button label="No" severity="danger" text @click="showDeleteDialog = false" />
          <Button label="Yes" severity="success" @click="deleteConfirmed" />
        </template>
      </Dialog>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
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
import Skeleton from 'primevue/skeleton';

const store = useOnsiteCampaignStore();
const showArchiveDialog = ref(false);
const campaignToArchive = ref(null);

const showDeleteDialog = ref(false);
const campaignToDelete = ref(null);

const toastr = getCurrentInstance().appContext.config.globalProperties.$toastr;


const calendarRef = ref(null);
const showDialog = ref(false);
const editMode = ref(false);
const loading = ref(false);
const isEditing = ref(false);
const modifiedCampaigns = ref(new Set());

const form = ref({
  name: "",
  campaign_type_id: "",
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
  height: 400,
  slotLabelDidMount: (info) => {
    info.el.style.padding = "6px 0";
  },

  eventDrop: async (info) => {
    const { id, start, end } = info.event;
    const campaign = store.campaigns.find((c) => String(c.wc_id) === id);
    if (!campaign) return;

    try {
      await store.editCampaign(id, {
        ...campaign,
        start_date: start ? start.toLocaleDateString("en-CA") : null,
        end_date: end ? end.toLocaleDateString("en-CA") : null,
      });

      toastr.success({
        severity: "success",
        summary: "Campaign Updated",
        detail: `${campaign.name} date updated.`,
        life: 2000,
      });

      await store.loadCampaigns();
      updateCalendarResourcesAndEvents();
    } catch (error) {
      toastr.error("Failed to update campaign date.");
      info.revert();
    }
  },

  eventResize: async (info) => {
    const { id, start, end } = info.event;
    const campaign = store.campaigns.find((c) => String(c.wc_id) === id);
    if (!campaign) return;

    try {
      await store.editCampaign(id, {
        ...campaign,
        start_date: start ? start.toLocaleDateString("en-CA") : null,
        end_date: end ? end.toLocaleDateString("en-CA") : null,
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
  await store.loadCampaignTypes();

  console.log("campaign types:", store.campaign_types);
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
    start: c.start_date ? new Date(c.start_date).toLocaleDateString("en-CA") : null,
    end: c.end_date
      ? new Date(new Date(c.end_date).setDate(new Date(c.end_date).getDate() + 1)).toLocaleDateString("en-CA")
      : null,
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
  form.value = { id: null, name: "", campaign_type_id: "", section_id: "", store_id: "", start_date: "", end_date: "" };
  editMode.value = false;
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
            campaign_type_id: campaign.campaign_type_id,
            section_id: campaign.section_id,
            store_id: campaign.store_id,
            start_date: campaign.start_date
              ? new Date(campaign.start_date).toLocaleDateString("en-CA")
              : null,
            end_date: campaign.end_date
              ? new Date(campaign.end_date).toLocaleDateString("en-CA")
              : null,
          });
        }
      }

      updateCalendarResourcesAndEvents();
      await store.loadCampaigns();

      toastr.success(
        "Saved",
        `${modifiedCampaigns.value.size} campaign(s) updated successfully.`
      );


      modifiedCampaigns.value.clear();

    } catch (error) {
      toastr.error("❌ Error saving edited table data:", error);
    } finally {
      loading.value = false;
    }
  }
};

function confirmArchive(data) {
  campaignToArchive.value = data;
  showArchiveDialog.value = true;
}

async function archiveConfirmed() {
  showArchiveDialog.value = false;
  if (!campaignToArchive.value) return;

  loading.value = true;
  try {
    await store.archiveCampaign(campaignToArchive.value.wc_id, true);
    await store.loadCampaigns();
    updateCalendarResourcesAndEvents();

    toastr.success("Campaign Archived", `Campaign "${campaignToArchive.value.name}" is now archived.`);

  } catch (error) {
    $toastr.error(
      "Failed to archive campaign.",
      "Error"
    );

  } finally {
    loading.value = false;
    campaignToArchive.value = null;
  }
}

function confirmDelete(data) {
  campaignToDelete.value = data;
  showDeleteDialog.value = true;
}

async function deleteConfirmed() {
  showDeleteDialog.value = false;
  if (!campaignToDelete.value) return;

  loading.value = true;
  try {
    await store.removeCampaign(campaignToDelete.value.wc_id);
    await store.loadCampaigns();
    updateCalendarResourcesAndEvents();

    $toastr.success(
      `Campaign "${campaignToDelete.value.name}" has been successfully deleted.`,
      "Campaign Deleted"
    );

  } catch (error) {
    $toastr.error(
      "Failed to delete campaign.",
      "Error"
    );

  } finally {
    loading.value = false;
    campaignToDelete.value = null;
  }
}


async function saveCampaign() {

  await store.addCampaign(form.value);
  showDialog.value = false;
  await store.loadCampaigns();
  updateCalendarResourcesAndEvents();
}

onMounted(async () => {
  await loadCampaigns();
  await store.loadStores();
  await store.loadSections();
  await store.loadCampaigns();
  await store.loadCampaignTypes();
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

.animate-pulse {
  animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.fc-toolbar-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #f9fafb;
}

.fc-datagrid-cell-main {
  font-weight: 500;
  color: #f3f4f6;
}

.fc-event {
  border-radius: 6px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.6);
  padding: 2px 4px;
}

:deep(.fc-event-title) {
  font-size: 11px !important;
}
</style>
