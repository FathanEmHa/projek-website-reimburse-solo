<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReimburseApproved extends Model
{
    protected $table = 'reimburse_approved'; 
    protected $fillable = [
        'reimburse_request_id',
        'approved_by',
        'action',
        'remarks',
        'approved_at',
    ];

    protected $dates = ['approved_at', 'created_at', 'updated_at'];

    public function request()
    {
        return $this->belongsTo(ReimburseRequest::class, 'reimburse_request_id');
    }

    public function approver()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }
}
