<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Account_Status extends Model {
    use HasFactory;
    protected $fillable = [
        'status'
    ];
    public function account_status() {
        return $this->belongsTo(Students::class, 'account_status_id', 'id');
    }
}

