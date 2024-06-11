<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Events extends Model
{
    public function event_status() {
        return $this->hasOne(Event_Status::class, 'event_status_id', 'id');
    }
    public function event_state() {
        return $this->hasOne(Event_State::class, 'event_state_id', 'id');
    }

    public function events() {
        return $this->belongsTo(Events::class, 'event_id', 'id');
    }
}
