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

Route::get('/getPosts', [\App\Http\Controllers\FreedomWallController::class, 
                                'getPosts'])->name('api.getPosts');     

Route::post('/createPostFW', 
        [\App\Http\Controllers\FreedomWallController::class, 'createPostFW'])
            ->name('api.createPostFW');

