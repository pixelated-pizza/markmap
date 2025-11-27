<?php

namespace App\Services;

use App\Models\WebsiteCampaign;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use App\Models\Campaign;

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
        $campaign = WebsiteCampaign::find($id);
        if (!$campaign) {
            return false;
        }

        return (bool) $campaign->delete();
    }

    public function archive(string $id): ?WebsiteCampaign
    {
        $campaign = WebsiteCampaign::find($id);
        if (!$campaign) {
            return null;
        }

        $campaign->is_archived = true;
        $campaign->save();

        return $campaign;
    }
}
