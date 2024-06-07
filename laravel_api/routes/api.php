<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

//Register
Route::post('/register', [\App\Http\Controllers\StudentsController::class, 
                                'register'])->name('api.register');

//Login
Route::post('/login', [\App\Http\Controllers\StudentsController::class, 
                                'login'])->name('api.login');

//Members
Route::get('/members', [\App\Http\Controllers\MembersController::class, 
                                'getMembers'])->name('api.getMembers');

//Member Requests
Route::get('/request', [\App\Http\Controllers\MembersController::class, 
                        'membershipRequest'])->name('api.membershipRequest');