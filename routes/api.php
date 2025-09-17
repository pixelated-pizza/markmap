<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CampaignController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::prefix('campaigns')->group(function () {
    Route::get('/', [CampaignController::class, 'index']);     
    Route::get('/{id}', [CampaignController::class, 'show']);   
    Route::post('/', [CampaignController::class, 'store']);     
    Route::put('/{id}', [CampaignController::class, 'update']); 
    Route::delete('/{id}', [CampaignController::class, 'destroy']); 
});
