<?php

namespace App\Services;

use App\Models\WebsiteSaleDetails;

use Illuminate\Support\Collection;

class WSDService
{
    public function all(): Collection
    {
        return WebsiteSaleDetails::get();
    }

    public function find(string $id): ?WebsiteSaleDetails
    {
        return WebsiteSaleDetails::find($id);
    }

    public function create(array $data): WebsiteSaleDetails
    {
        return WebsiteSaleDetails::create($data);
    }

    public function update(string $id, array $data): ?WebsiteSaleDetails
    {
        $wsd = WebsiteSaleDetails::find($id);
        if (!$wsd) {
            return null;
        }

        $wsd->update($data);
        return $wsd;
    }

    public function delete(string $id): bool
    {
        $wsd = WebsiteSaleDetails::find($id);
        if (!$wsd) {
            return false;
        }

        return (bool) $wsd->delete();
    }
    
}
