<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('website_sale_details', function (Blueprint $table) {
            $table->text('featured_products')->nullable()->after('sku_in_category_creative');
            $table->string('sale_title')->nullable()->after('featured_products');
            $table->string('sku_in_main_banner')->nullable()->after('sale_title');
        });
    }

    public function down()
    {
        Schema::table('website_sale_details', function (Blueprint $table) {
            $table->dropColumn([
                'featured_products',
                'sale_title',
                'sku_in_main_banner'
            ]);
        });
    }
};
