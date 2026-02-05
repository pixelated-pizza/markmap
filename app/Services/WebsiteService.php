<?php

namespace App\Services;

use App\Models\WebsiteCampaign;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use App\Models\Campaign;
use App\Models\ArchivedPromotion;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class WebsiteService
{
    public function all(): Collection
    {
        return WebsiteCampaign::with(['store', 'section'])
            ->where('is_archived', false)
            ->get();
    }

    public function find(string $id): ?WebsiteCampaign
    {
        return WebsiteCampaign::with(['store', 'section'])->find($id);
    }

    public function create(array $data): WebsiteCampaign
    {
        return DB::transaction(function () use ($data) {
            $website_campaign = WebsiteCampaign::create($data);

            if ($website_campaign->store->store_name === 'Website - Mytopia') {
                $channel_id = DB::table('category_channels')
                    ->where('name', 'Mytopia')
                    ->value('channel_id');
            } else if ($website_campaign->store->store_name === 'Website - Edisons') {
                $channel_id = DB::table('category_channels')
                    ->where('name', 'Edisons')
                    ->value('channel_id');
            }

            Campaign::create([
                'channel_id' => $channel_id,
                'name' => $data['name'],
                'background_color' => '#16a34a',
                'start_date' => $data['start_date'],
                'end_date' => $data['end_date'],
            ]);

            return $website_campaign;
        });
    }

    public function update(string $id, array $data): ?WebsiteCampaign
    {

        return DB::transaction(function () use ($id, $data) {
            $website_campaign = WebsiteCampaign::find($id);
            if (!$website_campaign) {
                return null;
            }

            $campaign = Campaign::where('name', $website_campaign->name)->first();


            $website_campaign->update($data);

            $website_campaign->load('store');

            if (in_array($website_campaign->store->store_name, ['Website - Edisons', 'Website - Mytopia'])) {

                if ($campaign) {
                    $campaign->update([
                        'name' => $data['name'],
                        'start_date' => $data['start_date'],
                        'end_date' => $data['end_date'],
                    ]);
                }
            }

            return $website_campaign;
        });
    }

    public function delete(string $id): bool
    {
        $website_campaign = WebsiteCampaign::find($id);
        if (!$website_campaign) {
            return false;
        }

        return DB::transaction(function () use ($website_campaign) {
            Campaign::where('campaign_id', $website_campaign->website_campaign_key)->delete();
            return (bool) $website_campaign->delete();
        });
    }

    public function archive(string $id): ?WebsiteCampaign
    {
        $campaign = WebsiteCampaign::find($id);
        if (!$campaign) {
            return null;
        }

        // Mark as archived
        $campaign->is_archived = true;
        $campaign->save();

        $promotionTypeId = DB::table('website_campaign_types')
            ->where('campaign_type_name', 'Adhoc Promos/Coupons')
            ->value('campaign_type_id');

        $websiteSaleId = DB::table('website_campaign_types')
            ->where('campaign_type_name', 'Website Sale')
            ->value('campaign_type_id');

        if ($campaign->campaign_type_id === $promotionTypeId) {
            try {
                ArchivedPromotion::create([
                    'archived_promo_id' => Str::uuid()->toString(),
                    'wc_id' => $campaign->wc_id,
                ]);
            } catch (\Exception $e) {
                Log::error("Failed to archive promotion: " . $e->getMessage());
            }
        } else if ($campaign->campaign_type_id === $websiteSaleId) {
            try {
                DB::table('archived_website_sales')->insert([
                    'ws_archive_id' => Str::uuid()->toString(),
                    'wc_id' => $campaign->wc_id,
                    'archived_at' => now(),
                ]);
            } catch (\Exception $e) {
                Log::error("Failed to archive website sale: " . $e->getMessage());
            }
        }

        return $campaign;
    }
}
