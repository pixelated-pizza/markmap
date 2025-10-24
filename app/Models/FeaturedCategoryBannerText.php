<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FeaturedCategoryBannerText extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'wsd_id',
        'banner_text',
    ];
}
