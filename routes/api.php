<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CampaignController;
use App\Http\Controllers\CategoryChannelController;
use App\Http\Controllers\StoreController;
use App\Http\Controllers\SectionController;
use App\Http\Controllers\AuthController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);
Route::get('/get-name', [AuthController::class, 'getUser'])->middleware('auth:sanctum');

Route::prefix('campaigns')->group(function () {
    Route::get('/', [CampaignController::class, 'index']);     
    Route::get('/{id}', [CampaignController::class, 'show']);   
    Route::post('/', [CampaignController::class, 'store']);     
    Route::put('/{id}', [CampaignController::class, 'update']); 
    Route::delete('/{id}', [CampaignController::class, 'destroy']); 
});

Route::prefix('category_channels')->group(function () {
    Route::get('/', [CategoryChannelController::class, 'index']);     
    Route::get('/{id}', [CategoryChannelController::class, 'show']);   
});

Route::prefix('website_campaign')->group(function() {
    Route::get('/', [CampaignController::class, 'index']);     
    Route::get('/{id}', [CampaignController::class, 'show']);   
    Route::post('/', [CampaignController::class, 'store']);     
    Route::put('/{id}', [CampaignController::class, 'update']); 
    Route::delete('/{id}', [CampaignController::class, 'destroy']); 
});


Route::prefix('stores')->group(function() {
    Route::get('/', [StoreController::class, 'index']);
});

Route::prefix('sections')->group(function() {
    Route::get('/', [SectionController::class, 'index']);
});