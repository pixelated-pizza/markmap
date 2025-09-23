<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Carbon\Carbon;

class WebsiteCampaign extends Model
{
    use HasUuids;

    protected $primaryKey = 'wc_id';
    public $incrementing = false;
    protected $keyType = 'string';

    public $timestamps = false;

    protected $fillable = [
        'name',
        'channel_id',
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
}
