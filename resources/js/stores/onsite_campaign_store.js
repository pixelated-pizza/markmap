import { defineStore } from 'pinia';
import { fetchOnsiteCampaign, createOnsiteCampaign, updateOnsiteCampaign, deleteOnsiteCampaign, archiveOnsiteCampaign } from '@/js/api/onsite_campaigns_api.js';
import { fetchStores } from '@/js/api/website_campaign_api';
import { fetchSections } from '@/js/api/website_campaign_api';
import { fetchCampaignTypes } from '@/js/api/onsite_campaigns_api';

const toAUDate = (date) => {
  if (!date) return null;
  const auDate = new Date(
    new Date(date).toLocaleString("en-US", { timeZone: "Australia/Sydney" })
  );

  const year = auDate.getFullYear();
  const month = String(auDate.getMonth() + 1).padStart(2, "0");
  const day = String(auDate.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`; 
};


export const useOnsiteCampaignStore = defineStore('onsiteCampaign', {
    state: () => ({
        campaigns: [],
        stores: [],
        sections: [],
        campaign_types: [],
        loading: false,
    }),
    actions: {
        async loadCampaigns() {
            this.loading = true;
            try {
                this.campaigns = await fetchOnsiteCampaign();
            } catch (error) {
                console.error('Failed to load campaigns', error);
            }
            this.loading = false;
        },
        async addCampaign(campaign) {
            try {
                const payload = {
                    name: campaign.name,
                    campaign_type_id: campaign.campaign_type_id,
                    section_id: campaign.section_id,
                    store_id: campaign.store_id,
                    is_applied_to_both_stores: campaign.is_all_store,
                    start_date: campaign.start_date
                        ? toAUDate(campaign.start_date)
                        : null,
                    end_date: campaign.end_date
                        ? toAUDate(campaign.end_date)
                        : null,
                };
                const newCampaign = await createOnsiteCampaign(payload);
                this.campaigns.push(newCampaign);
            } catch (error) {
                console.error('Failed to add campaign', error);
            }
        },
        async editCampaign(id, updates) {
            try {
                const updatedCampaign = await updateOnsiteCampaign(id, updates);
                const index = this.campaigns.findIndex(c => String(c.wc_id) === String(id));

                if (index !== -1) {
                    if (updatedCampaign && typeof updatedCampaign === "object") {
                        this.campaigns[index] = { ...this.campaigns[index], ...updatedCampaign };
                    } else {
                        this.campaigns[index] = { ...this.campaigns[index], ...updates };
                    }
                }
            } catch (error) {
                console.error("Failed to update campaign", error);
            }
        },

        async removeCampaign(id) {
            try {
                await deleteOnsiteCampaign(id);
                this.campaigns = this.campaigns.filter(c => c.wc_id !== id);
            } catch (error) {
                console.error('Failed to delete campaign', error);
            }
        },

        async archiveCampaign(id, is_archived) {
            try {
                const updatedCampaign = await archiveOnsiteCampaign(id, is_archived);
                const index = this.campaigns.findIndex(c => c.wc_id === id);
                if (index !== -1) {
                    this.campaigns[index] = updatedCampaign;
                }
            } catch (error) {
                console.error('Failed to archive campaign', error);
            }
        },

        async loadStores() {
            try {
                this.stores = await fetchStores();
                return this.stores;
            } catch (error) {
                console.error('Failed to load stores', error);
            }
        },

        async loadSections() {
            try {
                this.sections = await fetchSections();
            } catch (error) {
                console.error('Failed to load sections', error);
            }
        },

        async loadCampaignTypes() {
            try {
                this.campaign_types = await fetchCampaignTypes();
            } catch (error) {
                console.error('Failed to load campaign types', error);
            }
        }
    },
    getters: {
        allCampaigns: (state) => state.campaigns,
        isLoading: (state) => state.loading,
    }
});


