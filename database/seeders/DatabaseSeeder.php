<?php

namespace Database\Seeders;

use Database\Seeders\CategoryChannelSeeder;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RolesSeeder::class,
            CategoryChannelSeeder::class,
            SectionSeeder::class,
            StoreSeeder::class,
        ]);
    }
}
