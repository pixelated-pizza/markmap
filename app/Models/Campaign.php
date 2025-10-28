<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Carbon\Carbon;

class Campaign extends Model
{
    use HasUuids;

    protected $primaryKey = 'campaign_id';
    public $incrementing = false;
    protected $keyType = 'string';

    public $timestamps = false;

    protected $appends = ['channel_name'];

    protected $fillable = [
        'channel_id',
        'name',
        'background_color',
        'start_date',
        'end_date',
    ];

    protected $casts = [
        'start_date' => 'date:Y-m-d',
        'end_date' => 'date:Y-m-d',
    ];
    public function channel()
    {
        return $this->belongsTo(CategoryChannel::class, 'channel_id', 'channel_id');
    }

    public function getChannelNameAttribute()
    {
        return $this->channel->name ?? null;
    }
}
