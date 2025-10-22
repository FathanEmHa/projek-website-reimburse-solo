<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReimbursePayment extends Model
{
    protected $table = 'reimburse_payments'; 
    protected $fillable = [
        'id',
        'reimburse_request_id',
        'amount',
        'payment_method',
        'transaction_ref',
        'paid_by',
        'paid_at',
    ];

    public function request()
    {
        return $this->belongsTo(ReimburseRequest::class, 'request_id');
    }

    public function paidBy()
    {
        return $this->belongsTo(User::class, 'paid_by');
    }

    public function reimburseItem()
    {
        return $this->belongsTo(ReimburseItem::class, 'reimburse_item_id');
    }
}
