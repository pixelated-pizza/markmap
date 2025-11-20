<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Carbon\Carbon;

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
                'wsd.wsd_id as wsd_id',
                'wsd.terms_conditions',
                'wsd.mockup_banner_locations as mockup_banner_locations',
                'wsd.event_master_sheet_url as event_master_sheet',
                'wsd.run_sheet_url as run_sheet',
                'wsd.is_sku_list_to_feature as is_sku_list_to_feature',
                'wsd.featured_products_sheet_url',
                'wsd.ess',
                'wsd.cms_to_audit',
                'wsd.sku_in_category_creative',
                'wsd.featured_banner_text',
                'wsd.url_text'
            )

            ->orderBy('wc.start_date', 'asc')
            ->get();
    }

    public function find(string $id)
    {
        return DB::table('website_sale_details')->where('wsd_id', $id)->first();
    }

    public function create(array $data)
    {
        try {
            $existing = DB::table('website_sale_details')
                ->where('wc_id', $data['wc_id'])
                ->first();

            $campaign = DB::table('website_campaigns')
                ->where('wc_id', $data['wc_id'])
                ->first();

            $formattedEndDate = $campaign && $campaign->end_date
                ? Carbon::parse($campaign->end_date)->format('jS F Y')
                : 'TBA';

            // Always set required fields
            if (!isset($data['terms_conditions']) || $data['terms_conditions'] === null) {
                $data['terms_conditions'] = "Offer ends 11.59 PM AEDT {$formattedEndDate}. Cannot be combined with any other offer. Prices may change without notice.";
            }

            if (!isset($data['is_sku_list_to_feature']) || $data['is_sku_list_to_feature'] === null) {
                $data['is_sku_list_to_feature'] = 1;
            }

            // Fill other blank fields with empty string if needed
            $fields = [
                'ess',
                'cms_to_audit',
                'mockup_banner_locations',
                'event_master_sheet_url',
                'run_sheet_url',
                'featured_products_sheet_url',
                'sku_in_category_creative',
                'featured_banner_text',
                'url_text'
            ];

            foreach ($fields as $field) {
                $data[$field] = $data[$field] ?? '';
            }

            if ($existing) {
                DB::table('website_sale_details')
                    ->where('wsd_id', $existing->wsd_id)
                    ->update($data);

                return DB::table('website_sale_details')
                    ->where('wsd_id', $existing->wsd_id)
                    ->first();
            }

            $data['wsd_id'] = Str::uuid()->toString();
            DB::table('website_sale_details')->insert($data);

            return $data;
        } catch (\Throwable $e) {
            Log::error('Website Sale Details upsert failed', [
                'error' => $e->getMessage(),
                'data' => $data,
            ]);
            throw new \Exception('Failed to create Website Sale Details: ' . $e->getMessage());
        }
    }

    public function update(string $id, array $data)
    {
        $data = array_filter($data, fn($value) => !is_null($value));

        return DB::table('website_sale_details')->where('wsd_id', $id)->update($data);
    }

    public function delete(string $id)
    {
        return DB::table('website_sale_details')->where('wsd_id', $id)->delete();
    }

    public function blank_record(string $wc_id)
    {
        $campaign = DB::table('website_campaigns')->where('wc_id', $wc_id)->first();

        $formattedEndDate = $campaign && $campaign->end_date
            ? Carbon::parse($campaign->end_date)->format('jS F Y')
            : 'TBA';

        $data = ['wc_id' => $wc_id, 'wsd_id' => Str::uuid()->toString()];

        $defaultFields = [
            'ess',
            'cms_to_audit',
            'terms_conditions',
            'mockup_banner_locations',
            'event_master_sheet_url',
            'run_sheet_url',
            'sku_in_category_creative',
            'is_sku_list_to_feature',
            'featured_banner_text',
            'url_text',
        ];

        foreach ($defaultFields as $field) {
            if ($field === 'terms_conditions') {
                $data[$field] = "Offer ends 11.59 PM AEDT {$formattedEndDate}. Cannot be combined with any other offer. Prices may change without notice.";
            } elseif ($field === 'is_sku_list_to_feature') {
                $data[$field] = 1;
            } else {
                $data[$field] = '';
            }
        }

        return $data;
    }
}
