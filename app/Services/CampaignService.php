<?php

namespace App\Services;

use App\Models\Campaign;
use Illuminate\Support\Collection;

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
        return Campaign::create($data);
    }

    public function update(string $id, array $data): ?Campaign
    {
        $campaign = Campaign::find($id);
        if (!$campaign) {
            return null;
        }

        $campaign->update($data);
        return $campaign;
    }

    public function delete(string $id): bool
    {
        $campaign = Campaign::find($id);
        if (!$campaign) {
            return false;
        }

        return (bool) $campaign->delete();
    }
}
