<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CategoryChannel extends Model
{
    protected $primaryKey = 'channel_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'name',
    ];
}
