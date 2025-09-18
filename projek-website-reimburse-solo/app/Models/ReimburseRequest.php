<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReimburseRequest extends Model
{
    protected $fillable = ['id', 'user_id', 'request_code', 'date_submitted', 'status', 'total_amount', 'notes'];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            // Ambil tahun sekarang
            $year = date('Y');

            // Ambil nomor terakhir dari tahun ini
            $lastRequest = self::whereYear('created_at', $year)
                ->orderBy('id', 'desc')
                ->first();

            // Tentukan nomor urut
            $number = $lastRequest ? intval(substr($lastRequest->request_code, -4)) + 1 : 1;

            // Format: REQ-2025-0001
            $model->request_code = 'REQ-' . $year . '-' . str_pad($number, 4, '0', STR_PAD_LEFT);
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function items()
    {
        return $this->hasMany(ReimburseItem::class, 'request_id');
    }

    public function approvedLogs()
    {
        return $this->hasOne(ReimburseApproved::class, 'reimburse_request_id');
    }

    public function itemLogs()
    {
        return $this->hasMany(\App\Models\ReimburseItemLog::class, 'reimburse_request_id');
    }

    public function payment()
    {
        return $this->hasOne(ReimbursePayment::class, 'request_id');
    }
}
