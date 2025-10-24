<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WebsiteSaleDetails extends Model
{
    protected $primaryKey = 'wsd_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'wc_id',
        'terms_conditions',
        'mockup_banner_locations',
        'event_master_sheet_url',
        'run_sheet_url',
        'is_sku_list_to_feature',
        'ess',
        'cms_to_audit',
    ];

    public function websiteCampaign()
    {
        return $this->belongsTo(WebsiteCampaign::class, 'wc_id', 'wc_id');
    }
}
