<template>
  <div class="flex flex-col w-full h-full bg-gray-900 px-6 overflow-x-auto">
    <div class="bg-gray-900 rounded-lg p-3 mt-2">

      <h1 class="text-gray-200 font-semibold text-lg text-center p-2 bg-gray-700 rounded-full">Website Campaign Calendar - Edisons & Mytopia</h1>

      <!-- Calendar / Gantt -->
      <div class="h-[450px] overflow-hidden rounded-lg bg-black p-5 mb-5 rounded-md mt-5">
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

      <!-- Data Table -->
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

        <DataTable v-else :value="filteredCampaigns" sortField="start_date" :sortOrder="-1" dataKey="wc_id" paginator
          :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]" showGridlines scrollable scrollHeight="500px" stickyHeader
          tableStyle="min-width: 60rem;" :loading="loading" class="p-datatable-sm" tableLayout="fixed">
          <template #header>
            <div class="table-header flex flex-wrap gap-2 items-center p-2">
              <!-- Search -->
              <IconField class="w-60 relative">
                <InputIcon>
                  <i class="pi pi-search" />
                </InputIcon>
                <InputText placeholder="Search" v-model="searchQuery" class="w-full" />
              </IconField>

              
              <div class="relative w-60">
                <Select v-model="filterStore" :options="store.stores" optionLabel="store_name" optionValue="store_id"
                  placeholder="Filter by Website" class="w-full" />
                <button v-if="filterStore" @click="filterStore = null"
                  class="absolute right-8 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200">
                  <i class="pi pi-times"></i>
                </button>
              </div>

              <div class="relative w-60">
                <Select v-model="filterSection" :options="store.sections" optionLabel="name" optionValue="section_id"
                  placeholder="Filter by Section" class="w-full" />
                <button v-if="filterSection" @click="filterSection = null"
                  class="absolute right-8 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200">
                  <i class="pi pi-times"></i>
                </button>
              </div>
              <Button type="button" icon="pi pi-plus" label="Add Campaign" size="small" severity="success"
                :loading="loading" @click="openAddModal" />

            </div>

            

          </template>

          <Column field="name" header="Banner Name" class="w-1/4" :sortable="true">
            <template #body="{ data }">
              <span>{{ data.name }}</span>
            </template>
          </Column>

          <Column field="start_date" header="Start Date" class="w-1/6" :sortable="true">
            <template #body="{ data }">
              <span>{{ formatDate(data.start_date) }}</span>
            </template>
          </Column>

          <Column field="end_date" header="End Date" class="w-1/6">
            <template #body="{ data }">
              <span>{{ formatDate(data.end_date) }}</span>
            </template>
          </Column>

          <Column field="store_id" header="Website" class="w-1/6">
            <template #body="{ data }">
              <span>{{ data.store?.store_name }}</span>
            </template>
          </Column>

          <Column field="section_id" header="Section" class="w-1/6" :sortable="true">
            <template #body="{ data }">
              <span>{{ data.section?.name }}</span>
            </template>
          </Column>

          <Column header="Status" class="w-1/6">
            <template #body="{ data }">
              <span :class="statusClass(data)">{{ getStatus(data) }}</span>
            </template>
          </Column>

          <Column header="Action" class="w-1/6">
            <template #body="{ data }">
              <div class="flex flex-col gap-2">
                <Button type="button" icon="pi pi-pencil" label="Edit" size="small" severity="info"
                  :loading="loading && editTargetId === data.wc_id" @click="openEditModal(data)" />
              </div>
            </template>
          </Column>

          <template #empty>
            <div class="p-4 text-center text-gray-400">No Data available.</div>
          </template>
        </DataTable>
      </div>

      <Dialog v-model:visible="showDialog" modal :header="dialogHeader" :style="{ width: '30vw' }" class="app-dark">
        <div class="flex flex-col gap-3">
          <div>
            <label class="block text-gray-300 mb-1">Name</label>
            <InputText v-model="form.name" class="w-full" placeholder="Name of the Banner?" />
            <Message v-if="errors.name" severity="error" size="small" variant="simple">
              {{ errors.name }}
            </Message>
          </div>

          <div>
            <label class="block text-gray-300 mb-1">Campaign Category</label>
            <Select v-model="form.campaign_type_id" :options="store.campaign_types" optionLabel="campaign_type_name"
              optionValue="campaign_type_id" class="w-full" placeholder="Campaign Category" />
            <Message v-if="errors.campaign_type_id" severity="error" size="small" variant="simple">
              {{ errors.campaign_type_id }}
            </Message>

          </div>

          <div>
            <label class="block text-gray-300 mb-1">Where do we place this?</label>
            <Select v-model="form.section_id" :options="store.sections" optionLabel="name" optionValue="section_id"
              class="w-full" placeholder="Section Name" />
            <Message v-if="errors.section_id" severity="error" size="small" variant="simple">
              {{ errors.section_id }}
            </Message>

          </div>

          <div>
            <label class="block text-gray-300 mb-1">What Website?</label>
            <div class="flex items-center gap-2 mb-2 mt-2">
              <Checkbox v-model="form.is_all_store" inputId="all_store" binary />
              <label for="all_store" class="text-gray-300 cursor-pointer">Apply to Both Stores</label>
            </div>

            <Select v-model="form.store_id" :disabled="form.is_all_store" :options="store.stores"
              optionLabel="store_name" optionValue="store_id" class="w-full" placeholder="Name of the website" />

            <Message v-if="errors.store_id" severity="error" size="small" variant="simple">
              {{ errors.store_id }}
            </Message>

          </div>

          <div>
            <label class="block text-gray-300 mb-1">Start Date</label>
            <Calendar v-model="form.start_date" dateFormat="yy-mm-dd" showIcon class="w-full" />
            <Message v-if="errors.start_date" severity="error" size="small" variant="simple">
              {{ errors.start_date }}
            </Message>

          </div>

          <div>
            <label class="block text-gray-300 mb-1">End Date</label>
            <Calendar v-model="form.end_date" dateFormat="yy-mm-dd" showIcon class="w-full" />
            <Message v-if="errors.end_date" severity="error" size="small" variant="simple">
              {{ errors.end_date }}
            </Message>

          </div>
        </div>

        <template #footer>
          <div class="flex justify-between w-full">
            <div class="flex gap-2">
              <Button v-if="editTargetId" label="Archive" icon="pi pi-folder" severity="warn"
                @click="confirmArchive({ ...form, wc_id: editTargetId })" />

              <Button v-if="editTargetId" label="Delete" icon="pi pi-trash" severity="danger"
                @click="confirmDelete({ ...form, wc_id: editTargetId })" />
            </div>

            <div class="flex gap-2">
              <Button label="Cancel" severity="secondary" @click="closeDialog" />
              <Button :label="saving ? 'Saving...' : saveLabel" icon="pi pi-check" severity="success"
                @click="saveCampaign" :loading="saving" />
            </div>
          </div>
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
import { ref, computed, onMounted, getCurrentInstance } from 'vue';
import FullCalendar from '@fullcalendar/vue3';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';

import Message from 'primevue/message';

import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Checkbox from 'primevue/checkbox';
import InputText from 'primevue/inputtext';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import Calendar from 'primevue/calendar';
import { useOnsiteCampaignStore } from '@/stores/onsite_campaign_store.js';
import { Select } from 'primevue';
import Skeleton from 'primevue/skeleton';

const $instance = getCurrentInstance();
const toastr = $instance.appContext.config.globalProperties.$toastr;

const store = useOnsiteCampaignStore();

const calendarRef = ref(null);
const loading = ref(false);
const saving = ref(false);
const showDialog = ref(false);
const showArchiveDialog = ref(false);
const showDeleteDialog = ref(false);

const filterStore = ref(null);
const filterSection = ref(null);

const campaignToArchive = ref(null);
const campaignToDelete = ref(null);

const editTargetId = ref(null);

const searchQuery = ref('');

const today = new Date();
const todayStr = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');

const form = ref({
  name: '',
  campaign_type_id: '',
  section_id: '',
  store_id: '',
  start_date: '',
  end_date: '',
  is_all_store: false,
});

const errors = ref({
  name: null,
  campaign_type_id: null,
  section_id: null,
  store_id: null,
  start_date: null,
  end_date: null,
});

const calendarOptions = ref({
  schedulerLicenseKey: 'GPL-My-Project-Is-Open-Source',
  plugins: [resourceTimelinePlugin, dayGridPlugin, interactionPlugin],
  initialView: 'resourceTimelineMonth',
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'resourceTimelineMonth',
  },
  resourceAreaHeaderContent: 'On-site Campaigns',
  resources: [],
  events: [],
  editable: true,
  selectable: true,
  height: 400,
  slotLabelDidMount: (info) => { info.el.style.padding = '6px 0'; },
  eventDrop: async (info) => {
    const { id, start, end } = info.event;
    const campaign = store.campaigns.find((c) => String(c.wc_id) === id);
    if (!campaign) return;

    try {
      await store.editCampaign(id, {
        ...campaign,
        start_date: start ? start.toLocaleDateString('en-CA') : null,
        end_date: end ? end.toLocaleDateString('en-CA') : null,
      });

      toastr.success({ severity: 'success', summary: 'Campaign Updated', detail: `${campaign.name} date updated.`, life: 2000 });

      await store.loadCampaigns();
      updateCalendarResourcesAndEvents();
    } catch (error) {
      toastr.error('Failed to update campaign date.');
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
        start_date: start ? start.toLocaleDateString('en-CA') : null,
        end_date: end ? end.toLocaleDateString('en-CA') : null,
      });

      toastr.success({ severity: 'success', summary: 'Campaign Resized', detail: `${campaign.name} duration updated.`, life: 2000 });

      await store.loadCampaigns();
      updateCalendarResourcesAndEvents();
    } catch (error) {
      toastr.error('Failed to update campaign duration.');
      info.revert();
    }
  },
});

const filteredCampaigns = computed(() => {
  return store.campaigns.filter((c) => {
    const matchesSearch = !searchQuery.value || (
      c.name?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      c.store?.store_name?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      c.section?.name?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      String(c.start_date).toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      String(c.end_date).toLowerCase().includes(searchQuery.value.toLowerCase())
    );

    const matchesStore = !filterStore.value || String(c.store_id) === String(filterStore.value);
    const matchesSection = !filterSection.value || String(c.section_id) === String(filterSection.value);

    return matchesSearch && matchesStore && matchesSection;
  });
});


function formatDate(val) {
  if (!val) return '';
  try { return new Date(val).toLocaleDateString('en-GB'); } catch { return val; }
}

function isRunning(data) {
  const s = data.start_date;
  const e = data.end_date;
  return todayStr >= s && todayStr <= e;
}
function isCompleted(data) { return todayStr > data.end_date; }
function isUpcoming(data) { return todayStr < data.start_date; }
function getStatus(data) { return isRunning(data) ? 'Active' : isCompleted(data) ? 'Completed' : 'Upcoming'; }
function statusClass(data) {
  return {
    'text-yellow-400': isUpcoming(data),
    'text-green-400': isRunning(data),
    'text-gray-400': isCompleted(data),
  };
}

async function loadCampaigns() {
  loading.value = true;
  await store.loadCampaigns();
  await store.loadStores();
  await store.loadSections();
  await store.loadCampaignTypes();
  updateCalendarResourcesAndEvents();
  loading.value = false;
}

function updateCalendarResourcesAndEvents() {
  const resources = store.stores.map((st) => {
    const sections = store.sections
      .filter((sec) =>
        store.campaigns.some(
          (c) =>
            String(c.store_id) === String(st.store_id) &&
            String(c.section_id) === String(sec.section_id)
        )
      )
      .map((sec) => ({ id: `${String(st.store_id)}-${String(sec.section_id)}`, title: sec.name }));

    return { id: `store-${String(st.store_id)}`, title: st.store_name, children: sections };
  });

  const events = store.campaigns.map((c) => ({
    id: String(c.wc_id),
    resourceId: `${String(c.store_id)}-${String(c.section_id)}`,
    title: c.name,
    start: c.start_date
      ? new Date(c.start_date).toLocaleDateString('en-CA')
      : null,
    end: c.end_date
      ? new Date(new Date(c.end_date).setDate(new Date(c.end_date).getDate() + 1)).toLocaleDateString('en-CA')
      : null,

    // 🎨 Add colors here
    backgroundColor: getEventColor(c.name),
    borderColor: getEventColor(c.name),
    textColor: "#000"
  }));


  calendarOptions.value = { ...calendarOptions.value, resources, events };

  const calendarApi = calendarRef.value?.getApi();
  if (calendarApi) {
    // ✅ Only call if methods exist
    if (typeof calendarApi.removeAllResources === "function") {
      calendarApi.removeAllResources();
      resources.forEach((r) => calendarApi.addResource(r));
    }

    if (typeof calendarApi.removeAllEvents === "function") {
      calendarApi.removeAllEvents();
      events.forEach((e) => calendarApi.addEvent(e));
    }
  }
}


function openAddModal() {
  editTargetId.value = null;
  form.value = { name: '', campaign_type_id: '', section_id: '', store_id: '', start_date: '', end_date: '', is_all_store: false };
  showDialog.value = true;
}

function openEditModal(c) {
  editTargetId.value = c.wc_id;
  form.value = {
    name: c.name,
    campaign_type_id: c.campaign_type_id,
    section_id: c.section_id,
    store_id: c.store_id,
    start_date: c.start_date,
    end_date: c.end_date,
    is_all_store: false,
  };
  showDialog.value = true;
}

function closeDialog() {
  showDialog.value = false;
  editTargetId.value = null;
}

const dialogHeader = computed(() => (editTargetId.value ? 'Edit Campaign' : 'Add Campaign'));
const saveLabel = computed(() => (editTargetId.value ? 'Update' : 'Create'));

async function saveCampaign() {
  if (!validateForm()) {
    toastr.warning("Please correct the errors before saving.");
    return;
  }

  saving.value = true;

  const payload = {
    name: form.value.name,
    campaign_type_id: form.value.campaign_type_id,
    section_id: form.value.section_id,
    store_id: form.value.store_id,
    start_date: form.value.start_date ? new Date(form.value.start_date).toLocaleDateString('en-CA') : null,
    end_date: form.value.end_date ? new Date(form.value.end_date).toLocaleDateString('en-CA') : null,
  };

  try {
    if (editTargetId.value) {
      // Update main campaign
      await store.editCampaign(editTargetId.value, payload);

      if (form.value.is_all_store) {
        const promises = store.stores
          .filter(s => String(s.store_id) !== String(payload.store_id))
          .map(s => store.addCampaign({ ...payload, store_id: s.store_id }));

        const results = await Promise.allSettled(promises);

        const failedStores = results
          .map((res, idx) => res.status === "rejected" ? store.stores[idx].store_name : null)
          .filter(Boolean);

        if (failedStores.length) {
          toastr.warning(`Campaign updated, but failed to sync to: ${failedStores.join(", ")}`);
        } else {
          toastr.success("Campaign updated and synced to all stores.");
        }
      } else {
        toastr.success("Campaign updated.");
      }
    } else {
      // New campaign
      if (form.value.is_all_store) {
        const promises = store.stores.map(s => store.addCampaign({ ...payload, store_id: s.store_id }));
        const results = await Promise.allSettled(promises);

        const failedStores = results
          .map((res, idx) => res.status === "rejected" ? store.stores[idx].store_name : null)
          .filter(Boolean);

        if (failedStores.length) {
          toastr.warning(`Campaign added, but failed on: ${failedStores.join(", ")}`);
        } else {
          toastr.success("Campaign added to all stores.");
        }
      } else {
        await store.addCampaign(payload);
        toastr.success("Campaign added.");
      }
    }

    showDialog.value = false;
    await store.loadCampaigns();
    updateCalendarResourcesAndEvents();
  } catch (err) {
    console.error(err);
    toastr.error("Failed to save campaign."); // only fires if main operation fails
  } finally {
    saving.value = false;
  }
}


function confirmArchive(campaign) {
  campaignToArchive.value = campaign;
  showArchiveDialog.value = true;
}
function confirmDelete(campaign) {
  campaignToDelete.value = campaign;
  showDeleteDialog.value = true;
}


async function archiveConfirmed() {
  showArchiveDialog.value = false;
  if (!campaignToArchive.value) return;

  loading.value = true;
  try {
    await store.archiveCampaign(campaignToArchive.value.wc_id, true);
    await store.loadCampaigns();
    updateCalendarResourcesAndEvents();
    toastr.success('Campaign Archived');
  } catch (error) {
    toastr.error('Failed to archive campaign.');
  } finally {
    loading.value = false;
    campaignToArchive.value = null;
  }

  showDialog.value = false;
  editTargetId.value = null;
}

async function deleteConfirmed() {
  showDeleteDialog.value = false;
  if (!campaignToDelete.value) return;

  loading.value = true;
  try {
    await store.removeCampaign(campaignToDelete.value.wc_id);
    await store.loadCampaigns();
    updateCalendarResourcesAndEvents();
    toastr.success(`Campaign "${campaignToDelete.value.name}" has been successfully deleted.`);
  } catch (error) {
    toastr.error('Failed to delete campaign.');
  } finally {
    loading.value = false;
    campaignToDelete.value = null;
  }

  showDialog.value = false;
  editTargetId.value = null;
}

function validateForm() {
  let valid = true;

  // Reset
  Object.keys(errors.value).forEach(key => errors.value[key] = null);

  if (!form.value.name || form.value.name.trim() === "") {
    errors.value.name = "Name is required.";
    valid = false;
  }

  if (!form.value.campaign_type_id) {
    errors.value.campaign_type_id = "Select a campaign category.";
    valid = false;
  }

  if (!form.value.section_id) {
    errors.value.section_id = "Select a section.";
    valid = false;
  }

  if (!form.value.is_all_store && !form.value.store_id) {
    errors.value.store_id = "Select a store unless applying to all stores.";
    valid = false;
  }

  if (!form.value.start_date) {
    errors.value.start_date = "Start date is required.";
    valid = false;
  }

  if (!form.value.end_date) {
    errors.value.end_date = "End date is required.";
    valid = false;
  }

  if (form.value.start_date && form.value.end_date) {
    if (new Date(form.value.end_date) < new Date(form.value.start_date)) {
      errors.value.end_date = "End date cannot be earlier than start date.";
      valid = false;
    }
  }

  return valid;
}

function getEventColor(name) {
  if (!name) return "";

  if (name.toLowerCase().includes("hot deals")) {
    return "#ff4d4d";
  }

  const colors = [
    "#4da6ff", "#66cc99", "#ffcc66", "#cc99ff",
    "#66cccc", "#ff9966", "#99cc66"
  ];

  return colors[Math.floor(Math.random() * colors.length)];
}



onMounted(async () => {
  await loadCampaigns();
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