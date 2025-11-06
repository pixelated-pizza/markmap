import { defineStore } from "pinia";
import { fetchWSD, createWSD, updateWSD, deleteWSD } from "@/api/wsd_api.js";

export const useWSDStore = defineStore("wsd", {
  state: () => ({
    websiteSaleDetails: [],
    loading: false,
    error: null,
  }),

  actions: {
    async loadWSD() {
      this.loading = true;
      this.error = null;
      try {
        const data = await fetchWSD();
        this.websiteSaleDetails = data;
      } catch (err) {
        this.error = err.message || "Failed to load website sale details.";
      } finally {
        this.loading = false;
      }
    },

    async addWSD(newData) {
      const created = await createWSD(newData);
      this.websiteSaleDetails.push(created);
    },

    async editWSD(id, updates) {
      const updated = await updateWSD(id, updates);
      const index = this.websiteSaleDetails.findIndex((w) => w.id === id);
      if (index !== -1) this.websiteSaleDetails[index] = updated;
    },

    async removeWSD(id) {
      await deleteWSD(id);
      this.websiteSaleDetails = this.websiteSaleDetails.filter((w) => w.id !== id);
    },
  },
});
