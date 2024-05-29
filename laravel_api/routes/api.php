<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

//Register
Route::post('/register', [\App\Http\Controllers\StudentsController::class, 
                                'register'])->name('api.register');