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
            [
                'staff_id' => 'ADM001',
                'full_name' => 'M. Agung Gumelar S',
                'email' => 'agung@company.com',
                'password' => Hash::make('admin123'),
                'role' => 'super_admin',
                'department' => 'IT',
                'position' => 'System Administrator',
                'phone_number' => '081234567890',
                'address' => 'Ciputri',
                'profile_picture' => null,
                'bank_name' => 'BCA',
                'account_number'=> '1234567890',
                'theme_preference' => 'light',
                'languange' => 'id',
            ],

            // ==== Managers ====
            [
                'staff_id' => 'MNG001',
                'full_name' => 'Raphael Danish Saputra',
                'email' => 'rafael@company.com',
                'password' => Hash::make('manager123'),
                'role' => 'manager',
                'department' => 'IT',
                'position' => 'IT Manager',
                'phone_number' => '081222237898',
                'address' => 'Cipatik',
                'profile_picture' => null,
                'bank_name' => 'BCA',
                'account_number'=> '1876543210',
                'theme_preference' => 'light',
                'languange' => 'id',
            ],
            // ==== Finance ====
            [
                'staff_id' => 'FNC001',
                'full_name' => 'Fathan Mulyasa Hilman',
                'email' => 'fathan@company.com',
                'password' => Hash::make('finance123'),
                'role' => 'finance',
                'department' => 'Finance',
                'position' => 'Finance Manager',
                'phone_number' => '089504717033',
                'address' => 'Cipatik',
                'profile_picture' => null,
                'bank_name' => 'BCA',
                'account_number'=> '2613187450',
                'theme_preference' => 'light',
                'languange' => 'id',
            ],

            // ==== Employees ====
            [
                'staff_id' => 'EMP001',
                'full_name' => 'Adit Pratama',
                'email' => 'adit@company.com',
                'password' => Hash::make('user123'),
                'role' => 'employee',
                'department' => 'IT',
                'position' => 'Staff IT',
                'phone_number' => '089504367223',
                'address' => 'Cijerah',
                'profile_picture' => null,
                'bank_name' => 'BCA',
                'account_number'=> '3281819732',
                'theme_preference' => 'light',
                'languange' => 'id',
            ],
            [
                'staff_id' => 'EMP002',
                'full_name' => 'Light Yagami',
                'email' => 'light@company.com',
                'password' => Hash::make('user124'),
                'role' => 'employee',
                'department' => 'IT',
                'position' => 'Staff IT',
                'phone_number' => '089504367343',
                'address' => 'Cibodas',
                'profile_picture' => null,
                'bank_name' => 'BCA',
                'account_number'=> '1281098327',
                'theme_preference' => 'light',
                'languange' => 'id',
            ]
        ];

        foreach ($users as $u) {
            $deptId = DB::table('departments')->where('name', $u['department'])->value('id');

            User::updateOrCreate(
                ['email' => $u['email']],
                [
                    'staff_id'          => $u['staff_id'],
                    'full_name'         => $u['full_name'],
                    'email'             => $u['email'],
                    'password'          => $u['password'],
                    'role'              => $u['role'],
                    'department_id'     => $deptId,
                    'position'          => $u['position'],
                    'phone_number'      => $u['phone_number'],
                    'address'           => $u['address'],
                    'profile_picture'   => $u['profile_picture'],
                    'bank_name'         => $u['bank_name'],
                    'account_number'    => $u['account_number'],
                    'theme_preference'  => $u['theme_preference'],
                    'languange'         => $u['languange'],
                ]
            );
        }
    }
}
