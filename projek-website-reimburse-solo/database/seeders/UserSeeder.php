<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use App\Models\User;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            // ==== Admins ====
            ['name' => 'M. Agung G.S', 'email' => 'agung@company.com', 'role' => 'admin', 'department' => 'IT', 'password' => 'admin123'],

            // ==== Managers ====
            ['name' => 'Rafael D.S', 'email' => 'rafael@company.com', 'role' => 'manager', 'department' => 'HR', 'password' => 'manager123'],
            ['name' => 'Rizki Herlangga', 'email' => 'rizki@company.com', 'role' => 'manager', 'department' => 'HR', 'password' => 'manager124'],

            // ==== Finance ====
            ['name' => 'Fathan M.H', 'email' => 'fathan@company.com', 'role' => 'finance', 'department' => 'Finance', 'password' => 'finance123'],

            // ==== Employees ====
            ['name' => 'Adit Pratama', 'email' => 'adit@company.com', 'role' => 'employee', 'department' => 'Marketing', 'password' => 'user123'],
            ['name' => 'Kiki Ramadhan', 'email' => 'kiki@company.com', 'role' => 'employee', 'department' => 'Marketing', 'password' => 'user124'],
            ['name' => 'Rio Saputra', 'email' => 'rio@company.com', 'role' => 'employee', 'department' => 'Marketing', 'password' => 'user125'],
        ];

        foreach ($users as $u) {
            $deptId = DB::table('departments')->where('name', $u['department'])->value('id');

            User::updateOrCreate(
                ['email' => $u['email']],
                [
                    'name' => $u['name'],
                    'password' => Hash::make($u['password']),
                    'role' => $u['role'],
                    'department_id' => $deptId,
                ]
            );
        }
    }
}
