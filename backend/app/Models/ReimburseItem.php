<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReimburseItem extends Model
{
    protected $fillable = [
        'id',
        'request_id',
        'category_id',
        'expense_date',
        'description',
        'amount',
        'currency',
        'payment_method',
        'location',
        'invoice_number',
        'receipt_path',
        'status',
    ];

    protected static function booted()
    {
        static::creating(function ($model) {
            $year  = date('Y');
            $month = date('m');

            // Cari invoice terakhir di bulan & tahun ini
            $lastInvoice = self::whereYear('created_at', $year)
                ->whereMonth('created_at', $month)
                ->orderBy('id', 'desc')
                ->first();

            if ($lastInvoice) {
                // Ambil nomor urut terakhir
                $lastNumber = intval(substr($lastInvoice->invoice_number, -3));
                $newNumber  = str_pad($lastNumber + 1, 3, '0', STR_PAD_LEFT);
            } else {
                $newNumber = '001';
            }

            $model->invoice_number = "INV-{$year}-{$month}-{$newNumber}";
        });
    }

    public function request()
    {
        return $this->belongsTo(ReimburseRequest::class, 'request_id');
    }

    public function logs()
    {
        return $this->hasMany(\App\Models\ReimburseItemLog::class, 'reimburse_item_id');
    }

    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    public function payments()
    {
        return $this->hasMany(ReimbursePayment::class, 'reimburse_item_id');
    }
}
