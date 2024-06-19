<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Events extends Model
{
    protected $fillable = [
        'event_name', 
        'location', 
        'date', 
        'time', 
        'all_members_required',
        'has_reg_fee',
        'registration_fee',
        'max_attendees',
        'caption',
        'poster_loc',
        'event_status_id'
    ];
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
