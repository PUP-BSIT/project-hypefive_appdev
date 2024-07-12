<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Freedomwall extends Model
{
    protected $fillable = [
        'subject', 
        'content'
    ];

    public function post_status() {
      return $this->hasOne(Status::class, 'post_status_id', 'id');
  }
}
