<?php

namespace App\Http\Controllers;

use App\Models\WebsiteSaleDetails;

use Illuminate\Http\Request;

class WebsiteSaleDetailsController extends Controller
{
    public function index()
    {
        $details = WebsiteSaleDetails::all();
        return response()->json($details);
    }

    public function store(Request $request)
    {
        
    }

    public function show(string $id)
    {
        //
    }

    public function update(Request $request, string $id)
    {
        //
    }

    public function destroy(string $id)
    {
        //
    }
}
