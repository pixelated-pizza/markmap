<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('website_campaigns', function (Blueprint $table){
            $table->uuid('store_id')->after('section_id');
        });

        Schema::table('website_campaigns', function (Blueprint $table){
            $table->foreign('store_id')
                ->references('store_id')
                ->on('stores')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('website_campaigns', function (Blueprint $table){
            $table->dropColumn(['store_id']);
        });
         Schema::table('website_campaigns', function (Blueprint $table){
            $table->dropForeign(['store_id']);
        });
    }
};
