<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Login extends Model {
    use HasFactory;
    protected $table ='login';
    protected $primaryKey = 'id';
    protected $fillable = [
        'student_number', 
        'password'
    ];
    //define relation
    public function student() {
        return $this->hasOne(Students::class, 'user_id', 'id');
    }
}
