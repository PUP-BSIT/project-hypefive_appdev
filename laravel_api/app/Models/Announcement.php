<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Announcement extends Model
{
    use HasFactory;

    protected $fillable = ['subject', 'recipient', 'content', 'is_posted', 'student_id'];

    public function student()
    {
        return $this->belongsTo(Students::class, 'student_id', 'user_id');
    }
}
