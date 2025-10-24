<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SKUFeatureCategory extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'category_name',
        'wsd_id',
    ];
}
