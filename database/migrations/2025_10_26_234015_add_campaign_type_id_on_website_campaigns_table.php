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
        Schema::table('website_campaigns', function (Blueprint $table) {
            $table->uuid('campaign_type_id')->nullable()->after('wc_id');

            $table->foreign('campaign_type_id')
                  ->references('campaign_type_id')
                  ->on('website_campaign_types')
                  ->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('website_campaigns', function (Blueprint $table) {
            $table->dropForeign(['campaign_type_id']);
            $table->dropColumn('campaign_type_id');
        });
    }
};
