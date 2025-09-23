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
            $table->dropForeign(['channel_id']);
            $table->renameColumn('channel_id', 'section_id');
        });

        Schema::table('website_campaigns', function (Blueprint $table) {
             $table->foreign('section_id')
                  ->references('section_id')
                  ->on('sections') 
                  ->onDelete('cascade'); 
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('website_campaigns', function (Blueprint $table) {
            $table->dropForeign(['section_id']);

            $table->renameColumn('section_id', 'channel_id');
        });

        Schema::table('website_campaigns', function (Blueprint $table) {
            $table->foreign('channel_id')
                  ->references('id')
                  ->on('channels')
                  ->onDelete('cascade');
        });
    }
};
