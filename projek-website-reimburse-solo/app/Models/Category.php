<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    public function reimburseItems () {
        return $this->hasMany(ReimburseItem::class, 'category_id');
    }
}
