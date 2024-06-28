<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event_State extends Model
{
    public function event_state() {
        return $this->belongsTo(Event_State::class, 'event_state_id', 'id');
    }
}
