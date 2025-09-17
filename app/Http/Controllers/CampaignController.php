<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Services\CampaignService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class CampaignController extends Controller
{
    protected CampaignService $campaignService;

    public function __construct(CampaignService $campaignService)
    {
        $this->campaignService = $campaignService;
    }

    public function index(): JsonResponse
    {
        return response()->json($this->campaignService->all());
    }

    public function show(string $id): JsonResponse
    {
        $campaign = $this->campaignService->find($id);
        if (!$campaign) {
            return response()->json(['message' => 'Campaign not found'], 404);
        }
        return response()->json($campaign);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'parent_id' => 'nullable|uuid|exists:campaigns,campaign_id',
            'name' => 'required|string|max:255',
            'start_date' => 'required|date',
            'duration' => 'required|integer|min:1',
            'type' => 'nullable|in:campaign,website-mytopia,website-edisons,marketplaces',
        ]);

        return response()->json($this->campaignService->create($validated), 201);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $validated = $request->validate([
            'parent_id' => 'nullable|uuid|exists:campaigns,campaign_id',
            'name' => 'sometimes|required|string|max:255',
            'start_date' => 'sometimes|required|date',
            'duration' => 'sometimes|required|integer|min:1',
            'type' => 'nullable|in:campaign,website-mytopia,website-edisons,marketplaces',
        ]);

        $campaign = $this->campaignService->update($id, $validated);

        if (!$campaign) {
            return response()->json(['message' => 'Campaign not found'], 404);
        }

        return response()->json($campaign);
    }

    public function destroy(string $id): JsonResponse
    {
        if (!$this->campaignService->delete($id)) {
            return response()->json(['message' => 'Campaign not found'], 404);
        }

        return response()->json(['message' => 'Campaign deleted']);
    }
}
