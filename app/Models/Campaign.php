<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Campaign extends Model
{
    use HasUuids;

    protected $primaryKey = 'campaign_id'; 
    public $incrementing = false;            
    protected $keyType = 'string';           

    protected $fillable = [
        'parent_id',
        'name',
        'start_date',
        'duration',
        'type'
    ];

    public function parent()
    {
        return $this->belongsTo(Campaign::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(Campaign::class, 'parent_id');
    }

    public function getEndDateAttribute()
    {
        return \Carbon\Carbon::parse($this->start_date)->addDays($this->duration);
    }
}
