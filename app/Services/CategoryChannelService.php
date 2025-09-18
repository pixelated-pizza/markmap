<?php

namespace App\Services;

use App\Models\CategoryChannel;
use Illuminate\Support\Collection;

class CategoryChannelService
{
    /**
     * Get all category channels
     *
     * @return Collection
     */
    public function all(): Collection
    {
        return CategoryChannel::orderBy('name')->get();
    }

    /**
     * Find a single category channel by ID
     *
     * @param string $id
     * @return CategoryChannel|null
     */
    public function find(string $id): ?CategoryChannel
    {
        return CategoryChannel::find($id);
    }

    /**
     * Optional: Create a new category channel
     *
     * @param array $data
     * @return CategoryChannel
     */
    public function create(array $data): CategoryChannel
    {
        return CategoryChannel::create($data);
    }

    /**
     * Optional: Update a category channel
     *
     * @param string $id
     * @param array $data
     * @return CategoryChannel|null
     */
    public function update(string $id, array $data): ?CategoryChannel
    {
        $channel = CategoryChannel::find($id);
        if (!$channel) return null;
        $channel->update($data);
        return $channel;
    }

    /**
     * Optional: Delete a category channel
     *
     * @param string $id
     * @return bool
     */
    public function delete(string $id): bool
    {
        $channel = CategoryChannel::find($id);
        if (!$channel) return false;
        return (bool) $channel->delete();
    }
}
