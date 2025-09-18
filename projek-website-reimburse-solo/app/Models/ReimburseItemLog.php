<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\ReimburseItem;
use App\Models\ReimburseRequest;
use App\Models\User;

class ReimburseItemLog extends Model
{
    protected $table = 'reimburse_item_logs';
    protected $fillable = [
        'reimburse_item_id',
        'reimburse_request_id',
        'acted_by',
        'action',
        'remarks',
    ];

    public function item(): BelongsTo
    {
        return $this->belongsTo(ReimburseItem::class, 'reimburse_item_id');
    }

    public function request(): BelongsTo
    {
        return $this->belongsTo(ReimburseRequest::class, 'reimburse_request_id');
    }

    public function actor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'acted_by');
    }
}
