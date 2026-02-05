<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CampaignController;
use App\Http\Controllers\WebsiteCampaignController;
use App\Http\Controllers\WebsiteCampaignTypeController;
use App\Http\Controllers\CategoryChannelController;
use App\Http\Controllers\StoreController;
use App\Http\Controllers\SectionController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\WebsiteSaleDetailsController;
use App\Http\Controllers\ArchivedPromotionController;
use App\Http\Controllers\ArchivedWebsiteSaleController;

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

Route::prefix('website_campaign_types')->group(function() {
    Route::get('/', [WebsiteCampaignTypeController::class, 'index']);
});

Route::prefix('onsite_campaign')->group(function() {
    Route::get('/', [WebsiteCampaignController::class, 'index']);     
    Route::get('/{id}', [WebsiteCampaignController::class, 'show']);   
    Route::post('/', [WebsiteCampaignController::class, 'store']);     
    Route::put('/{id}', [WebsiteCampaignController::class, 'update']); 
    Route::delete('/{id}', [WebsiteCampaignController::class, 'destroy']);
    Route::patch('/archive/{id}', [WebsiteCampaignController::class, 'archive_campaign']);
});

Route::prefix('website_sale_details')->group(function() {
    Route::get('/', [WebsiteSaleDetailsController::class, 'index']);     
    Route::post('/', [WebsiteSaleDetailsController::class, 'store']);
    Route::put('/{id}',[WebsiteSaleDetailsController::class, 'update']);
    Route::get('/blank/{wc_id}', [WebsiteSaleDetailsController::class, 'blank']);    
});

Route::prefix('archived_promotions')->group(function() {
    Route::get('/', [ArchivedPromotionController::class, 'index']);     
    Route::get('/{id}', [ArchivedPromotionController::class, 'show']);   
    Route::post('/', [ArchivedPromotionController::class, 'store']);     
    Route::put('/{id}', [ArchivedPromotionController::class, 'update']); 
    Route::delete('/{id}', [ArchivedPromotionController::class, 'destroy']);
    Route::put('/unarchive/{id}', [ArchivedPromotionController::class, 'unarchive']); 
});

Route::prefix('archived_website_sales')->group(function() {
    Route::get('/', [ArchivedWebsiteSaleController::class, 'index']);     
    Route::get('/{id}', [ArchivedWebsiteSaleController::class, 'show']);   
    Route::post('/', [ArchivedWebsiteSaleController::class, 'store']);     
    Route::put('/unarchive/{id}', [ArchivedWebsiteSaleController::class, 'unarchive']); 
});


