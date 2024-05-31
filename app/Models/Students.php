<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Students extends Model {
    use HasFactory;
    // protected $table = 'students';
    // protected $primaryKey = 'id';
    protected $fillable = [
        'first_name', 
        'last_name', 
        'student_number', 
        'birthday', 
        'gender',
    ];
    //define relation
    public function user() {
        return $this->hasOne(User::class, 'user_id', 'id');
    }
    public function role() {
        return $this->hasOne(Roles::class, 'role_id', 'id');
    }

    public function account_status() {
        return $this->hasOne(Account_Status::class, 'account_status_id', 'id');
    }

    public function announcements() {
        return $this->belongsTo(Students::class, 'student_id', 'id');
    }
}