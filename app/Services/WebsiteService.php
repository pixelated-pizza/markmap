<?php

namespace App\Services;
use App\Models\WebsiteCampaign;
use Illuminate\Support\Collection;

class WebsiteService
{
    public function all(): Collection
    {
        return WebsiteCampaign::with(['store','section'])
            ->where('is_archived', false)
            ->get(); 
    }

    public function find(string $id): ?WebsiteCampaign
    {
        return WebsiteCampaign::with(['store','section'])->find($id);
    }

    public function create(array $data): WebsiteCampaign
    {
        return WebsiteCampaign::create($data);
    }

    public function update(string $id, array $data): ?WebsiteCampaign
    {
        $campaign = WebsiteCampaign::find($id);
        if (!$campaign) {
            return null;
        }

        $campaign->update($data);
        return $campaign;
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
