<?php

namespace App\Http\Controllers;

use App\Services\CampaignService;
use Illuminate\Http\Request;

class CampaignController extends Controller
{
    public function __construct(protected CampaignService $campaigns) {}

    public function index()
    {
        return response()->json($this->campaigns->getAll());
    }

    public function store(Request $request)
    {
        $campaign = $this->campaigns->create($request->all());
        return response()->json($campaign, 201);
    }

    public function show($id)
    {
        return response()->json($this->campaigns->getById($id));
    }

    public function update(Request $request, $id)
    {
        $campaign = $this->campaigns->update($id, $request->all());
        return response()->json($campaign);
    }

    public function destroy($id)
    {
        $this->campaigns->delete($id);
        return response()->json(null, 204);
    }
}
