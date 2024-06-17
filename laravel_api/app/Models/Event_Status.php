<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event_Status extends Model
{
    public function event_status() {
        return $this->belongsTo(Event_Status::class, 'event_status_id', 'id');
    }
}
