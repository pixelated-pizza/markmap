import { defineStore } from 'pinia';
import { fetchWebsitePromotions } from '@/js/api/website_promos_api.js';
import { fetchStores } from '@/js/api/website_campaign_api';

export const useWebsitePromosStore = defineStore('websitePromos', {
    state: () => ({
        websitePromotions: [],
        stores: [],
        loading: false,
    }),
    actions: {
        async loadWebsitePromotions() {
            this.loading = true;
            try {
                this.websitePromotions = await fetchWebsitePromotions();
            } catch (error) {
                console.error('Failed to load website promotions', error);
            }
            this.loading = false;
        },

        async loadStores() {
            try {
                this.stores = await fetchStores();
            } catch (error) {
                console.error('Failed to load stores', error);
            }
        },
    },
    getters: {
        allWebsitePromotions: (state) => state.websitePromotions,
    }
});