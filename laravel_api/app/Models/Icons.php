<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Icons extends Model
{
    public function icons() {
        return $this->belongsTo(Icons::class, 'icons_id', 'id');
    }
}
