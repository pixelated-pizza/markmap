<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class URLTextLandingPage extends Model
{
    public $timestamps = false;
    protected $fillable = [
        'wsd_id',
        'landing_page_url',
    ];
}
