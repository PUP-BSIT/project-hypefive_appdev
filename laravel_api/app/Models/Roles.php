<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Role extends Model {
    use HasFactory;

    public function role() {
        return $this->belongsTo(Students::class, 'role_id', 'id');
    }
}

