<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Registration extends Model
{
    public function events() {
        return $this->hasOne(Events::class, 'event_id', 'id');
    }

    public function student() {
        return $this->hasOne(Students::class, 'student_id', 'id');
    }
}
