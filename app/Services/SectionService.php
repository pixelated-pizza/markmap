<?php

namespace App\Services;
use App\Models\Section;
use Illuminate\Support\Collection;

class SectionService
{
    public function all(): Collection {
        return Section::get();
    }
}
