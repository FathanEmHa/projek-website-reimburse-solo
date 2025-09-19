<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use App\Models\User;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call(DepartmentsSeeder::class);
        $this->call(CategoriesSeeder::class);
        $this->call(UserSeeder::class);
    }
}
