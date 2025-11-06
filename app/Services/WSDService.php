<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;

class WSDService
{
    public function all()
    {
        return DB::table('website_campaigns as wc')
            ->leftJoin('website_sale_details as wsd', 'wc.wc_id', '=', 'wsd.wc_id')
            ->join('website_campaign_types as wct', 'wc.campaign_type_id', '=', 'wct.campaign_type_id')
            ->join('stores as s', 'wc.store_id', '=', 's.store_id')
            ->where(function ($query) {
                $query->where('wct.campaign_type_name', 'Website Sale')
                      ->orWhere('wc.campaign_type_id', 'Website Sale');
            })
            ->select(
                'wc.wc_id as campaign_id',
                'wc.name as name',
                'wc.start_date',
                'wc.end_date',
                's.store_name as store_name',
                'wct.campaign_type_name as campaign_type',
                'wsd.wsd_id as id',
                'wsd.terms_conditions',
                'wsd.mockup_banner_locations as mockup_locations',
                'wsd.event_master_sheet_url as event_master_sheet',
                'wsd.run_sheet_url as run_sheet',
                'wsd.is_sku_list_to_feature as sku_list_provided',
                'wsd.ess',
                'wsd.cms_to_audit'
            )
            ->orderBy('wc.start_date', 'desc')
            ->get();
    }

    public function find(string $id)
    {
        return DB::table('website_sale_details')->where('wsd_id', $id)->first();
    }

    public function create(array $data)
    {
        return DB::table('website_sale_details')->insertGetId($data);
    }

    public function update(string $id, array $data)
    {
        return DB::table('website_sale_details')->where('wsd_id', $id)->update($data);
    }

    public function delete(string $id)
    {
        return DB::table('website_sale_details')->where('wsd_id', $id)->delete();
    }
}
