<template>
    <div class="wsd-wrapper dark:bg-gray-900 bg-white">
        <div class="wsd-header">
            <h4 class="wsd-title">Website Sale Details</h4>
        </div>

        <!-- Loading skeleton -->
        <template v-if="loading">
            <div class="flex flex-col gap-4 p-5">
                <p class="text-gray-400 text-sm tracking-wide">Initializing spreadsheet...</p>
                <Skeleton height="2rem" width="60%" />
                <Skeleton height="1.5rem" width="80%" />
                <Skeleton height="1.5rem" width="75%" />
                <Skeleton height="1.5rem" width="90%" />
                <Skeleton height="1.5rem" width="70%" />
            </div>
        </template>

        <div v-else class="wsd-body">
            <!-- Toolbar — mimics Google Sheets -->
            <div class="sheets-toolbar">
                <div class="toolbar-left">
                    <!-- Search -->
                    <div class="toolbar-search">
                        <svg class="search-icon" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clip-rule="evenodd" />
                        </svg>
                        <input
                            v-model="searchQuery"
                            placeholder="Search campaigns..."
                            class="search-input"
                            @input="onSearch"
                        />
                    </div>

                    <!-- Filter -->
                    <div class="toolbar-divider" />
                    <label class="toolbar-label">Status:</label>
                    <select v-model="campaignFilter" class="toolbar-select" @change="applyFilter">
                        <option value="ALL">All</option>
                        <option value="RUNNING">🟢 Running</option>
                        <option value="UPCOMING">🟡 Upcoming</option>
                        <option value="ENDED">🔴 Ended</option>
                    </select>
                </div>

                <div class="toolbar-right">
                    <!-- Sync status — like Google Sheets "Saving..." -->
                    <transition name="fade">
                        <span class="sync-status" :class="syncStatusClass">
                            <span class="sync-dot" :class="syncDotClass" />
                            {{ syncStatusText }}
                        </span>
                    </transition>

                    <!-- Export CSV -->
                    <button class="toolbar-btn toolbar-btn--export" @click="exportCSV">
                        <svg viewBox="0 0 20 20" fill="currentColor" class="btn-icon">
                            <path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" />
                            <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
                        </svg>
                        Export CSV
                    </button>
                </div>
            </div>

            <!-- Handsontable grid -->
            <div class="hot-outer">
                <HotTable
                    ref="hotRef"
                    :data="displayData"
                    :columns="hotColumns"
                    :colHeaders="colHeaders"
                    :rowHeaders="true"
                    :fixedColumnsStart="3"
                    :contextMenu="contextMenuConfig"
                    :manualColumnResize="true"
                    :manualColumnMove="true"
                    :multiColumnSorting="true"
                    :filters="true"
                    :dropdownMenu="['filter_by_condition', 'filter_by_value', 'filter_action_bar']"
                    :autoWrapRow="true"
                    :autoWrapCol="false"
                    :licenseKey="'non-commercial-and-evaluation'"
                    :height="'68vh'"
                    :wordWrap="true"
                    :outsideClickDeselects="true"
                    :selectionMode="'range'"
                    :afterChange="onAfterChange"
                    :cells="cellsMeta"
                    :columnHeaderHeight="36"
                    :rowHeights="54"
                    :renderAllRows="false"
                    class="hot-instance"
                    @hook:mounted="onHotMounted"
                />
            </div>
        </div>

        <!-- Image preview lightbox -->
        <Teleport to="body">
            <Transition name="lightbox">
                <div v-if="lightboxUrl" class="lightbox-overlay" @click.self="lightboxUrl = null">
                    <div class="lightbox-box">
                        <button class="lightbox-close" @click="lightboxUrl = null">✕</button>
                        <img :src="lightboxUrl" class="lightbox-img" alt="Banner preview" />
                    </div>
                </div>
            </Transition>
        </Teleport>

        <!-- Hidden file input for image upload -->
        <input
            ref="fileInputRef"
            type="file"
            accept="image/*"
            class="hidden"
            @change="onFileSelected"
        />

        <!-- Re-run Modal -->
        <Dialog
            v-model:visible="rerunModalVisible"
            header="Re-run Campaign"
            :modal="true"
            :closable="true"
            class="w-96"
        >
            <div class="flex flex-col gap-3 pt-2">
                <label class="font-semibold text-sm">New Start Date</label>
                <InputText type="date" v-model="newStartDate" class="w-full" />
                <label class="font-semibold text-sm">New End Date</label>
                <InputText type="date" v-model="newEndDate" class="w-full" />
                <div class="mt-4 flex justify-end gap-2">
                    <Button label="Cancel" icon="pi pi-times" severity="secondary" @click="rerunModalVisible = false" />
                    <Button label="Submit" icon="pi pi-check" severity="success" @click="submitRerunCampaign" />
                </div>
            </div>
        </Dialog>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, getCurrentInstance, nextTick } from "vue";
import { HotTable } from "@handsontable/vue3";
import { registerAllModules } from "handsontable/registry";
import Skeleton   from "primevue/skeleton";
import Dialog     from "primevue/dialog";
import Button     from "primevue/button";
import InputText  from "primevue/inputtext";
import axios      from "axios";
import { useWSDStore }            from "@/js/stores/wsd_store";
import { useOnsiteCampaignStore } from "@/js/stores/onsite_campaign_store.js";
import { useUIStore }             from "@/js/stores/ui.js";
import "handsontable/dist/handsontable.full.min.css";

registerAllModules();

// ─── Stores & globals ─────────────────────────────────────────────────────────
const ui      = useUIStore();
const wsdStore = useWSDStore();
const store   = useOnsiteCampaignStore();
const toastr  = getCurrentInstance().appContext.config.globalProperties.$toastr;

// ─── Refs ─────────────────────────────────────────────────────────────────────
const hotRef        = ref(null);
const fileInputRef  = ref(null);
const loading       = ref(false);
const searchQuery   = ref("");
const campaignFilter = ref("ALL");
const syncStatus    = ref("idle");   // idle | saving | saved | error
const lightboxUrl   = ref(null);
const pendingUploadRow = ref(null);  // tracks which row triggered file input

// ─── Re-run modal ─────────────────────────────────────────────────────────────
const rerunModalVisible  = ref(false);
const rerunCampaignData  = ref(null);
const newStartDate       = ref("");
const newEndDate         = ref("");

// ─── Sync indicator ───────────────────────────────────────────────────────────
const syncStatusText = computed(() => ({
    idle:   "All changes saved",
    saving: "Saving...",
    saved:  "All changes saved",
    error:  "Error saving",
}[syncStatus.value]));

const syncStatusClass = computed(() => ({
    idle:   "sync--idle",
    saving: "sync--saving",
    saved:  "sync--saved",
    error:  "sync--error",
}[syncStatus.value]));

const syncDotClass = computed(() => ({
    idle:   "dot--idle",
    saving: "dot--saving",
    saved:  "dot--saved",
    error:  "dot--error",
}[syncStatus.value]));

// ─── Status helper ─────────────────────────────────────────────────────────────
function getStatus(row) {
    if (!row.start_date || !row.end_date) return "UPCOMING";
    const today = new Date();
    const start = new Date(row.start_date);
    const end   = new Date(row.end_date);
    if (today >= start && today <= end) return "RUNNING";
    if (today > end)                    return "ENDED";
    return "UPCOMING";
}

// ─── Computed display data ────────────────────────────────────────────────────
const displayData = computed(() => {
    let data = (wsdStore.websiteSaleDetails ?? []).map(c => ({
        ...c,
        status:      getStatus(c),
        statusOrder: { RUNNING: 1, UPCOMING: 2, ENDED: 3 }[getStatus(c)],
    }));

    if (searchQuery.value) {
        const q = searchQuery.value.toLowerCase();
        data = data.filter(c =>
            c.name?.toLowerCase().includes(q) ||
            c.store_name?.toLowerCase().includes(q)
        );
    }

    if (campaignFilter.value !== "ALL") {
        data = data.filter(c => c.status === campaignFilter.value);
    }

    return [...data].sort((a, b) => new Date(b.start_date) - new Date(a.start_date));
});

// Re-render HOT when data changes
watch(displayData, () => hotRef.value?.hotInstance?.render());

// ─── Column headers ───────────────────────────────────────────────────────────
const colHeaders = [
    "Status",
    "Channel",
    "Event Name",
    "Start Date",
    "End Date",
    "Featured Products Sheet",
    "Run Sheet URL",
    "Event Master Sheet",
    "ESS to Execute",
    "CMS to Audit",
    "T&Cs",
    "Mockup & Banner Locations",
    "Mock Banner Image",          // ← new image column
    "SKU List to Feature?",
    "Featured Banner Text",
    "SKU in Category Creative",
    "URL Text",
    "Actions",
];

// ─── Column definitions ────────────────────────────────────────────────────────
const hotColumns = [
    // ── Frozen read-only ──
    { data: "status",      readOnly: true, renderer: statusRenderer,  width: 110 },
    { data: "store_name",  readOnly: true, renderer: textRenderer,    width: 130 },
    { data: "name",        readOnly: true, renderer: textRenderer,    width: 220 },
    // ── Read-only dates ──
    { data: "start_date",  readOnly: true, renderer: dateRenderer,    width: 175 },
    { data: "end_date",    readOnly: true, renderer: dateRenderer,    width: 175 },
    // ── Editable text/URL ──
    { data: "featured_products_sheet_url", renderer: urlRenderer,  width: 210 },
    { data: "run_sheet_url",               renderer: urlRenderer,  width: 180 },
    { data: "event_master_sheet_url",      renderer: urlRenderer,  width: 180 },
    { data: "ess",                         renderer: textRenderer, width: 160 },
    { data: "cms_to_audit",                renderer: textRenderer, width: 160 },
    { data: "terms_conditions",            renderer: textRenderer, width: 200 },
    { data: "mockup_banner_locations",     renderer: textRenderer, width: 200 },
    // ── Image column ──
    { data: "mockup_banner_img", readOnly: true, renderer: imageRenderer, width: 160 },
    // ── Checkbox ──
    {
        data: "is_sku_list_to_feature",
        type: "checkbox",
        checkedTemplate: 1,
        uncheckedTemplate: 0,
        width: 150,
    },
    // ── More editable text ──
    { data: "featured_banner_text",      renderer: textRenderer, width: 200 },
    { data: "sku_in_category_creative",  renderer: textRenderer, width: 200 },
    { data: "url_text",                  renderer: textRenderer, width: 180 },
    // ── Actions (read-only) ──
    { data: "wc_id", readOnly: true, renderer: actionsRenderer, width: 160 },
];

// ─── Cell meta — lock read-only columns visually ──────────────────────────────
function cellsMeta(row, col) {
    const readOnlyCols = [0, 1, 2, 3, 4, 12, 17]; // status, store, name, dates, img, actions
    if (readOnlyCols.includes(col)) {
        return { readOnly: true, className: "htReadOnly cell-readonly" };
    }
    return { className: "cell-editable" };
}

// ─── Renderers ────────────────────────────────────────────────────────────────
function textRenderer(instance, td, row, col, prop, value) {
    td.innerHTML = "";
    td.textContent = value ?? "";
    td.style.verticalAlign = "middle";
    td.style.padding = "6px 8px";
    td.style.fontSize = "13px";
    if (!value) td.style.color = "#9ca3af";
    return td;
}

function urlRenderer(instance, td, row, col, prop, value) {
    td.innerHTML = "";
    if (value && (value.startsWith("http://") || value.startsWith("https://"))) {
        const a = document.createElement("a");
        a.href = value;
        a.textContent = value;
        a.target = "_blank";
        a.style.cssText = "color:#1a73e8;text-decoration:underline;font-size:12px;word-break:break-all;";
        a.onclick = (e) => e.stopPropagation();
        td.appendChild(a);
    } else {
        td.textContent = value ?? "";
        td.style.color = value ? "#202124" : "#9ca3af";
        td.style.fontSize = "13px";
    }
    td.style.verticalAlign = "middle";
    td.style.padding = "6px 8px";
    return td;
}

function dateRenderer(instance, td, row, col, prop, value) {
    td.innerHTML = "";
    td.textContent = value
        ? new Date(value).toLocaleString("en-US", {
              year: "numeric", month: "short", day: "numeric",
              hour: "numeric", minute: "2-digit", hour12: true,
          })
        : "—";
    td.style.cssText = "color:#6b7280;font-size:12px;vertical-align:middle;padding:6px 8px;";
    return td;
}

function statusRenderer(instance, td, row, col, prop, value) {
    td.innerHTML = "";
    const badge = document.createElement("span");
    badge.textContent = value ?? "—";
    const colors = {
        RUNNING:  { bg: "#dcfce7", color: "#15803d", border: "#86efac" },
        ENDED:    { bg: "#fee2e2", color: "#b91c1c", border: "#fca5a5" },
        UPCOMING: { bg: "#fef9c3", color: "#854d0e", border: "#fde047" },
    };
    const c = colors[value] ?? { bg: "#f3f4f6", color: "#6b7280", border: "#d1d5db" };
    badge.style.cssText = `
        display:inline-flex;align-items:center;padding:2px 10px;
        border-radius:9999px;font-size:11px;font-weight:600;
        letter-spacing:0.4px;border:1px solid ${c.border};
        background:${c.bg};color:${c.color};
    `;
    td.appendChild(badge);
    td.style.cssText = "text-align:center;vertical-align:middle;padding:6px 8px;";
    return td;
}

function imageRenderer(instance, td, row, col, prop, value) {
    td.innerHTML = "";
    td.style.cssText = "text-align:center;vertical-align:middle;padding:4px;";

    if (value) {
        // Thumbnail with click-to-preview
        const wrap = document.createElement("div");
        wrap.style.cssText = "display:flex;flex-direction:column;align-items:center;gap:4px;";

        const img = document.createElement("img");
        img.src = value;
        img.style.cssText = "max-height:44px;max-width:100px;object-fit:contain;border-radius:4px;cursor:pointer;border:1px solid #e5e7eb;";
        img.title = "Click to preview";
        img.onclick = (e) => {
            e.stopPropagation();
            lightboxUrl.value = value;
        };

        const actions = document.createElement("div");
        actions.style.cssText = "display:flex;gap:4px;";

        // Replace button
        const replaceBtn = document.createElement("button");
        replaceBtn.innerHTML = "🔄";
        replaceBtn.title = "Replace image";
        replaceBtn.style.cssText = "font-size:11px;padding:2px 5px;border:1px solid #d1d5db;border-radius:3px;cursor:pointer;background:#f9fafb;";
        replaceBtn.onclick = (e) => { e.stopPropagation(); triggerUpload(row); };

        // Delete button
        const delBtn = document.createElement("button");
        delBtn.innerHTML = "🗑";
        delBtn.title = "Remove image";
        delBtn.style.cssText = "font-size:11px;padding:2px 5px;border:1px solid #fca5a5;border-radius:3px;cursor:pointer;background:#fef2f2;";
        delBtn.onclick = (e) => { e.stopPropagation(); deleteImage(row); };

        actions.appendChild(replaceBtn);
        actions.appendChild(delBtn);
        wrap.appendChild(img);
        wrap.appendChild(actions);
        td.appendChild(wrap);
    } else {
        // Upload button when empty
        const btn = document.createElement("button");
        btn.innerHTML = "📷 Upload";
        btn.style.cssText = `
            padding:5px 12px;font-size:12px;border-radius:4px;cursor:pointer;
            border:1px dashed #93c5fd;background:#eff6ff;color:#1d4ed8;
            font-weight:500;transition:all 0.15s;
        `;
        btn.onmouseenter = () => btn.style.background = "#dbeafe";
        btn.onmouseleave = () => btn.style.background = "#eff6ff";
        btn.onclick = (e) => { e.stopPropagation(); triggerUpload(row); };
        td.appendChild(btn);
    }
    return td;
}

function actionsRenderer(instance, td, row, col, prop, value) {
    td.innerHTML = "";
    td.style.cssText = "text-align:center;vertical-align:middle;padding:4px 8px;";

    const rowData = displayData.value[row];
    if (!rowData) return td;

    if (getStatus(rowData) === "ENDED") {
        const btn = document.createElement("button");
        btn.innerHTML = "🔄 Re-run";
        btn.style.cssText = `
            padding:5px 10px;font-size:12px;border-radius:4px;cursor:pointer;
            border:1px solid #fbbf24;background:#fffbeb;color:#92400e;font-weight:600;
        `;
        btn.onclick = (e) => { e.stopPropagation(); openRerunModal(rowData); };
        td.appendChild(btn);
    }
    return td;
}

// ─── Context menu ─────────────────────────────────────────────────────────────
const contextMenuConfig = {
    items: {
        upload_image: {
            name: "📷 Upload image to this cell",
            callback(key, selection) {
                const row = selection[0].start.row;
                const col = selection[0].start.col;
                if (col === 12) triggerUpload(row); // only image column
            },
        },
        "---------": { name: "---------" },
        copy:  { name: "Copy"  },
        cut:   { name: "Cut"   },
        paste: { name: "Paste" },
    },
};

// ─── Image upload helpers ─────────────────────────────────────────────────────
function triggerUpload(row) {
    pendingUploadRow.value = row;
    fileInputRef.value.value = "";
    fileInputRef.value.click();
}

async function onFileSelected(event) {
    const file = event.target.files[0];
    if (!file || pendingUploadRow.value === null) return;

    const rowData = displayData.value[pendingUploadRow.value];
    if (!rowData?.wc_id) return;

    ui.showLoader();
    syncStatus.value = "saving";

    try {
        const formData = new FormData();
        formData.append("wc_id",  rowData.wc_id);
        formData.append("image",  file);

        const { data } = await axios.post("/api/wsd/image", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        const idx = wsdStore.websiteSaleDetails.findIndex(c => c.wc_id === rowData.wc_id);
        if (idx !== -1) wsdStore.websiteSaleDetails[idx].mockup_banner_img = data.url;

        syncStatus.value = "saved";
        setSyncIdle();
        toastr.success("Image uploaded successfully.");
    } catch {
        syncStatus.value = "error";
        toastr.error("Image upload failed.");
    } finally {
        ui.hideLoader();
        pendingUploadRow.value = null;
    }
}

async function deleteImage(row) {
    const rowData = displayData.value[row];
    if (!rowData?.wc_id) return;

    ui.showLoader();
    try {
        await axios.delete(`/api/wsd/image/${rowData.wc_id}`);

        const idx = wsdStore.websiteSaleDetails.findIndex(c => c.wc_id === rowData.wc_id);
        if (idx !== -1) wsdStore.websiteSaleDetails[idx].mockup_banner_img = null;

        toastr.success("Image removed.");
    } catch {
        toastr.error("Failed to remove image.");
    } finally {
        ui.hideLoader();
    }
}

// ─── Cell edit handler ────────────────────────────────────────────────────────
const READ_ONLY_PROPS = ["status", "store_name", "name", "start_date", "end_date", "mock_banner_img", "wc_id"];

const onAfterChange = async (changes, source) => {
    if (!changes || source === "loadData") return;

    for (const [row, prop, oldVal, newVal] of changes) {
        if (oldVal === newVal)              continue;
        if (READ_ONLY_PROPS.includes(prop)) continue;

        const rowData = displayData.value[row];
        if (!rowData?.wc_id) continue;

        syncStatus.value = "saving";
        ui.showLoader();

        try {
            await wsdStore.addWSD({
                wc_id:                        rowData.wc_id,
                featured_products_sheet_url:  rowData.featured_products_sheet_url,
                run_sheet_url:                rowData.run_sheet_url,
                event_master_sheet_url:       rowData.event_master_sheet_url,
                ess:                          rowData.ess,
                cms_to_audit:                 rowData.cms_to_audit,
                terms_conditions:             rowData.terms_conditions,
                mockup_banner_locations:      rowData.mockup_banner_locations,
                is_sku_list_to_feature:       rowData.is_sku_list_to_feature,
                featured_banner_text:         rowData.featured_banner_text,
                sku_in_category_creative:     rowData.sku_in_category_creative,
                url_text:                     rowData.url_text,
            });

            syncStatus.value = "saved";
            setSyncIdle();
        } catch (err) {
            syncStatus.value = "error";
            toastr.error("Failed to save changes.");
            console.error(err);
        } finally {
            ui.hideLoader();
        }
    }
};

// ─── Search & filter ──────────────────────────────────────────────────────────
function onSearch()   { hotRef.value?.hotInstance?.render(); }
function applyFilter(){ hotRef.value?.hotInstance?.render(); }

// ─── Export CSV ───────────────────────────────────────────────────────────────
function exportCSV() {
    const hot = hotRef.value?.hotInstance;
    if (!hot) return;
    hot.getPlugin("exportFile").downloadFile("csv", {
        filename:      `wsd-${new Date().toISOString().slice(0, 10)}`,
        columnHeaders: true,
        rowHeaders:    false,
    });
}

// ─── HOT mounted hook ─────────────────────────────────────────────────────────
function onHotMounted() {
    // nothing needed — just a hook for future extensions
}

// ─── Sync idle timer ──────────────────────────────────────────────────────────
let syncTimer = null;
function setSyncIdle() {
    clearTimeout(syncTimer);
    syncTimer = setTimeout(() => (syncStatus.value = "idle"), 3000);
}
onUnmounted(() => clearTimeout(syncTimer));

// ─── Re-run modal ─────────────────────────────────────────────────────────────
function openRerunModal(campaign) {
    rerunCampaignData.value = campaign;
    newStartDate.value = campaign.start_date?.slice(0, 10) ?? "";
    newEndDate.value   = campaign.end_date?.slice(0, 10) ?? "";
    rerunModalVisible.value = true;
}

async function submitRerunCampaign() {
    if (!newStartDate.value || !newEndDate.value) {
        toastr.error("Please select both start and end dates.");
        return;
    }
    if (newEndDate.value < newStartDate.value) {
        toastr.error("End date cannot be before start date.");
        return;
    }
    ui.showLoader();
    try {
        await store.editCampaign(rerunCampaignData.value.wc_id, {
            wc_id:      rerunCampaignData.value.wc_id,
            name:       rerunCampaignData.value.name,
            start_date: newStartDate.value,
            end_date:   newEndDate.value,
        });
        await wsdStore.loadWSD();
        toastr.success("Campaign re-run successfully.");
        rerunModalVisible.value = false;
    } catch {
        toastr.error("Failed to re-run campaign.");
    } finally {
        ui.hideLoader();
    }
}

// ─── Status interval refresh ──────────────────────────────────────────────────
const statusInterval = setInterval(() => {
    wsdStore.websiteSaleDetails?.forEach(c => {
        c.status = getStatus(c);
    });
}, 30_000);
onUnmounted(() => clearInterval(statusInterval));

onMounted(async () => {
    loading.value = true;
    await wsdStore.loadWSD();
    loading.value = false;

    // Wait for DOM to fully paint before HOT measures dimensions
    await nextTick();
    setTimeout(() => {
        hotRef.value?.hotInstance?.refreshDimensions();
    }, 300);
});
</script>

<style scoped>
/* ── Wrapper ── */
.wsd-wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
    font-family: "Google Sans", "Segoe UI", Arial, sans-serif;
}

.wsd-header {
    padding: 12px 16px 0;
}

.wsd-title {
    font-size: 16px;
    font-weight: 600;
    text-align: center;
    color: #202124;
    letter-spacing: -0.2px;
}

.app-dark .wsd-title { color: #f9fafb; }

.wsd-body {
    display: flex;
    flex-direction: column;
    flex: 1;
    padding: 8px 12px 12px;
    gap: 0;
}

/* ── Toolbar ── */
.sheets-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 8px;
    padding: 6px 10px;
    background: #f8f9fa;
    border: 1px solid #dadce0;
    border-bottom: none;
    border-radius: 6px 6px 0 0;
}

.dark .sheets-toolbar {
    background: #1f2937;
    border-color: #374151;
}

.toolbar-left, .toolbar-right {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
}

.toolbar-divider {
    width: 1px;
    height: 18px;
    background: #dadce0;
}

.toolbar-label {
    font-size: 12px;
    color: #5f6368;
    font-weight: 500;
}

.dark .toolbar-label { color: #9ca3af; }

.toolbar-search {
    position: relative;
    display: flex;
    align-items: center;
}

.search-icon {
    position: absolute;
    left: 8px;
    width: 14px;
    height: 14px;
    color: #9ca3af;
    pointer-events: none;
}

.search-input {
    padding: 5px 10px 5px 28px;
    border: 1px solid #dadce0;
    border-radius: 4px;
    font-size: 13px;
    width: 210px;
    background: white;
    color: #202124;
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;
}

.dark .search-input {
    background: #374151;
    border-color: #4b5563;
    color: #f9fafb;
}

.search-input:focus {
    border-color: #1a73e8;
    box-shadow: 0 0 0 2px rgba(26,115,232,0.18);
}

.toolbar-select {
    padding: 4px 8px;
    border: 1px solid #dadce0;
    border-radius: 4px;
    font-size: 13px;
    background: white;
    color: #202124;
    cursor: pointer;
    outline: none;
}

.dark .toolbar-select {
    background: #374151;
    border-color: #4b5563;
    color: #f9fafb;
}

/* ── Sync status ── */
.sync-status {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 12px;
    font-weight: 500;
    padding: 3px 8px;
    border-radius: 4px;
    transition: all 0.2s;
}
.sync--idle   { color: #5f6368; }
.sync--saving { color: #b45309; background: #fef9c3; }
.sync--saved  { color: #15803d; background: #dcfce7; }
.sync--error  { color: #b91c1c; background: #fee2e2; }

.sync-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    flex-shrink: 0;
}
.dot--idle   { background: #9ca3af; }
.dot--saving { background: #f59e0b; animation: pulse 1s infinite; }
.dot--saved  { background: #22c55e; }
.dot--error  { background: #ef4444; }

@keyframes pulse {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.3; }
}

/* ── Toolbar buttons ── */
.toolbar-btn {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 5px 12px;
    border-radius: 4px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    border: 1px solid transparent;
    transition: background 0.15s, border-color 0.15s;
}

.toolbar-btn--export {
    background: white;
    border-color: #dadce0;
    color: #3c4043;
}
.toolbar-btn--export:hover {
    background: #f1f3f4;
    border-color: #c6c6c6;
}

.btn-icon {
    width: 14px;
    height: 14px;
}

/* ── Handsontable container ── */
.hot-outer {
    border: 1px solid #dadce0;
    border-radius: 0 0 6px 6px;
    overflow: hidden;
    flex: 1;
}

/* ── HOT cell overrides — match Google Sheets look ── */
:deep(.handsontable) {
    font-family: "Google Sans", "Segoe UI", Arial, sans-serif;
    font-size: 13px;
}

:deep(.handsontable th) {
    background: #f8f9fa !important;
    color: #202124;
    font-weight: 600;
    font-size: 12px;
    border-color: #e0e0e0 !important;
    letter-spacing: 0.1px;
}

:deep(.handsontable td) {
    border-color: #e0e0e0 !important;
    color: #202124;
}

:deep(.cell-readonly) {
    background: #f8f9fa !important;
    color: #5f6368 !important;
}

:deep(.cell-editable:hover) {
    background: #f0f7ff !important;
}

:deep(.handsontable .htDimmed) {
    color: #5f6368;
}

/* ── Lightbox ── */
.lightbox-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.72);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
}

.lightbox-box {
    position: relative;
    max-width: 90vw;
    max-height: 88vh;
    background: white;
    border-radius: 10px;
    padding: 16px;
    box-shadow: 0 24px 64px rgba(0,0,0,0.4);
}

.lightbox-close {
    position: absolute;
    top: 8px;
    right: 10px;
    font-size: 18px;
    background: none;
    border: none;
    cursor: pointer;
    color: #5f6368;
    line-height: 1;
    padding: 4px;
}

.lightbox-close:hover { color: #202124; }

.lightbox-img {
    max-width: 85vw;
    max-height: 80vh;
    object-fit: contain;
    border-radius: 6px;
    display: block;
}

/* ── Lightbox transition ── */
.lightbox-enter-active, .lightbox-leave-active { transition: opacity 0.2s ease; }
.lightbox-enter-from, .lightbox-leave-to       { opacity: 0; }

/* ── Fade transition for sync status ── */
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to       { opacity: 0; }
</style>