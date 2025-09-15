<?php

namespace App\Services;

use App\Models\Campaign;
use Illuminate\Support\Str;

class CampaignService
{

    public function getAll()
    {
        return Campaign::with('children')->get();
    }


    public function getById(string $id)
    {
        return Campaign::with('children')->findOrFail($id);
    }


    public function create(array $data): Campaign
    {
        $data['campaign_id'] = Str::uuid()->toString();

        return Campaign::create($data);
    }


    public function update(string $id, array $data): Campaign
    {
        $campaign = Campaign::findOrFail($id);
        $campaign->update($data);

        return $campaign;
    }

    public function delete(string $id): bool
    {
        $campaign = Campaign::findOrFail($id);

        return $campaign->delete();
    }
}
