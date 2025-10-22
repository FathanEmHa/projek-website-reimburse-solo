<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    use Notifiable;

    /**
     * Kolom yang bisa diisi mass assignment
     */
    protected $fillable = [
        'staff_id',
        'full_name',
        'email',
        'password',
        'department',
        'position',
        'phone_number',
        'address',
        'profile_picture',
        'bank_name',
        'account_number',
        'theme_preference',
        'languange',
        'role',
        'is_active',
    ];

    /**
     * Kolom yang disembunyikan saat model dikonversi ke array / JSON
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Tipe data otomatis dikonversi
     */
    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * Relasi ke tabel reimburse_requests (1 user bisa punya banyak request)
     */
    public function requests()
    {
        return $this->hasMany(ReimburseRequest::class, 'user_id');
    }

    /**
     * Relasi ke tabel departments
     * (hapus ini kalau kolom department di tabel users hanya berupa string)
     */
    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    /**
     * Implementasi JWTSubject
     */
    public function getJWTIdentifier()
    {
        return $this->getKey(); // biasanya primary key (id)
    }

    public function getJWTCustomClaims()
    {
        return [
            'role' => $this->role,
            'email' => $this->email,
            'name' => $this->full_name,
        ];
    }
}
