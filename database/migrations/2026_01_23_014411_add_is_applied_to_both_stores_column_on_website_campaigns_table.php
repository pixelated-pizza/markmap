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
            $table->boolean('is_applied_to_both_stores')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('website_campaigns', function (Blueprint $table) {
            $table->dropColumn('is_applied_to_both_stores');
        });
    }
};
