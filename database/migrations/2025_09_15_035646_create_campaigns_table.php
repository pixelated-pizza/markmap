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
        Schema::create('campaigns', function (Blueprint $table) {
            $table->uuid('campaign_id')->primary();
            $table->uuid('parent_id')->nullable();

            $table->string('name');
            $table->date('start_date');
            $table->integer('duration');
            $table->enum('type', ['campaign', 'website-mytopia', 'website-edisons', 'marketplaces'])
                ->nullable();

            $table->foreign('parent_id')
                ->references('campaign_id')
                ->on('campaigns')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('campaigns');
    }
};
