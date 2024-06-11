<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Announce;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

//Register
Route::post('/register', [\App\Http\Controllers\StudentsController::class, 
                                'register'])->name('api.register');

//Login
Route::post('/login', [\App\Http\Controllers\StudentsController::class, 
                                'login'])->name('api.login');

Route::get('/announcements', [Announce::class, 'getAnnouncements']);
Route::post('/announcements', [Announce::class, 'createAnnouncement']);
Route::put('/announcements/{announcement}', [Announce::class, 'updateAnnouncement']);
Route::delete('/announcements/{announcement}', [Announce::class, 'deleteAnnouncement']);
                               
Route::middleware('jwt.auth')->get('/retrieve/{id}&{email}', [\App\Http\Controllers\StudentsController::class, 'retrieve']);
