<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Students extends Model {
    use HasFactory;
    public $timestamps = false;
    protected $fillable = [
        'first_name', 
        'last_name', 
        'student_number', 
        'birthday', 
        'gender',
    ];

    public function user() {
        return $this->hasOne(User::class, 'user_id', 'id');
    }

    public function role() {
        return $this->hasOne(Roles::class, 'role_id', 'id');
    }

    public function icons() {
        return $this->hasOne(Icons::class, 'icons_id', 'id');
    }
    
    public function announcements() {
        return $this->belongsTo(Students::class, 'student_id', 'id');
    }


    public function student() {
        return $this->belongsTo(Students::class, 'student_id', 'id');
    }
}