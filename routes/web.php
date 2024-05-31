<?php

use Illuminate\Support\Facades\Route;
use App\Http\Middleware\CheckToken;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/login', function () {
    return view('welcome');
});

Route::middleware([CheckToken::class])->group(function () {
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