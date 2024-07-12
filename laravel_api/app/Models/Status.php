<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Status extends Model {
    use HasFactory;
    public function account_status() {
        return $this->belongsTo(User::class, 'account_status_id', 'id');
    }

    public function post_status() {
      return $this->belongsTo(Freedomwall::class, 'post_status_id', 'id');
  }
}

