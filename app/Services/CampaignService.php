<?php

namespace App\Services;

use App\Models\Campaign;
use App\Models\WebsiteCampaign;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class CampaignService
{

    public function all(): Collection
    {
        return Campaign::with('channel')->get();
    }

    public function find(string $id): ?Campaign
    {
        return Campaign::with('channel')->find($id);
    }

    public function create(array $data): Campaign
    {
        return DB::transaction(function () use ($data) {

            $campaign = Campaign::create($data);

            $campaign->load('channel');

            if (in_array($campaign->channel->name, ['Edisons', 'Mytopia'])) {

                $campaign_type_id = DB::table('website_campaign_types')
                    ->where('campaign_type_name', 'Website Sale')
                    ->value('campaign_type_id');

                $section_id = DB::table('sections')
                    ->where('name', 'Landing Page Banner')
                    ->value('section_id');

                $store_id = DB::table('stores')
                    ->where('store_name', 'Website - Mytopia')
                    ->value('store_id');

                WebsiteCampaign::create([
                    'name' => $data['name'],
                    'campaign_type_id' => $campaign_type_id,
                    'section_id' => $section_id,
                    'store_id' => $store_id,
                    'start_date' => $data['start_date'],
                    'end_date' => $data['end_date'],
                ]);
            }


            return $campaign;
        });
    }

    public function update(string $id, array $data): ?Campaign
    {
        return DB::transaction(function () use ($id, $data) {

            $campaign = Campaign::find($id);
            if (!$campaign) {
                return null;
            }
            $websiteCampaign = WebsiteCampaign::where('name', $campaign->name)->first();

            $campaign->update($data);

            $campaign->load('store');

            if (in_array($campaign->channel->name, ['Edisons', 'Mytopia'])) {

                if ($websiteCampaign) {
                    $websiteCampaign->update([
                        'name' => $data['name'],
                        'start_date' => $data['start_date'],
                        'end_date' => $data['end_date'],
                    ]);
                }
            }

            return $campaign;
        });
    }

    public function delete(string $id): bool
    {
        $campaign = Campaign::find($id);
        if (!$campaign) {
            return false;
        }

        // $websiteCampaign = WebsiteCampaign::where('name', $campaign->name)->first();

        // if($campaign){
        //     WebsiteCampaign::get()->where('name', $campaign) == to be continued
        // }

        return (bool) $campaign->delete();
    }
}
