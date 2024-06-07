<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Announcements extends Model {
    use HasFactory;
    protected $fillable = [
        'subject',
        'content'
    ];

    public function students() {
        return $this->hasOne(Students::class, 'student_id', 'id');
    }
}
