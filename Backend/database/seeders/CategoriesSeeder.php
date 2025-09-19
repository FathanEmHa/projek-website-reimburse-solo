<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategoriesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('categories')->delete(); // jangan truncate, aman untuk FK

        $categories = [
            ['name' => 'Transportasi', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Akomodasi', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Makan & Minum', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Perlengkapan / ATK (Alat Tulis Kantor)', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Komunikasi', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Kesehatan', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Representasi / Entertainment', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Pelatihan & Seminar', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Lain-lain', 'created_at' => now(), 'updated_at' => now()],
        ];

        DB::table('categories')->insert($categories);
    }
}
