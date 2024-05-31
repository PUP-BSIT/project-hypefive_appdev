<?php

use Illuminate\Support\Facades\Route;
use App\Http\Middleware\CheckToken;

Route::get('/', function () {
    return view('welcome');
});

//Check token
Route::middleware([CheckToken::class])->group(function () {
    Route::get('/login', function () {
        return view('welcome');
    });

    Route::get('/dashboard', function () {
        return view('welcome');
    });

    Route::get('/freedom-wall', function () {
        return view('welcome');
    });

    Route::get('/events', function () {
        return view('welcome');
    });

    Route::get('/members', function () {
        return view('welcome');
    });

    Route::get('/archive', function () {
        return view('welcome');
    });
});