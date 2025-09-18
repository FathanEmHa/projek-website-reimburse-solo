<?php
namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    use Notifiable;

    // Kolom yang bisa diisi mass assignment
    protected $fillable = ['name', 'email', 'password', 'role', 'department_id'];

    // Relasi ke tabel reimburse_requests
    public function requests()
    {
        return $this->hasMany(ReimburseRequest::class, 'user_id');
    }  

    /**
     * Implementasi JWTSubject
     */
    public function getJWTIdentifier()
    {
        return $this->getKey(); // biasanya pakai primary key (id)
    }

    public function getJWTCustomClaims()
    {
        return []; // bisa ditambahkan custom claims kalau perlu
    }

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

}
