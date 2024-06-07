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

//Accept Member Request                        
Route::post('/acceptMember', [\App\Http\Controllers\MembersController::class, 
                                'acceptMember'])->name('api.acceptMember');

//Decline Member Request                        
Route::post('/declineMember', [\App\Http\Controllers\MembersController::class, 
                                'declineMember'])->name('api.declineMember');

//Get officers
Route::get('/getOfficers', [\App\Http\Controllers\MembersController::class, 
                        'getOfficers'])->name('api.getOfficers');

//Add to officer
Route::post('/promoteToOfficer', [\App\Http\Controllers\MembersController::class, 
                            'promoteToOfficer'])->name('api.promoteToOfficer');

//Add to officer
Route::post('/demoteToMember', [\App\Http\Controllers\MembersController::class, 
                            'demoteToMember'])->name('api.demoteToMember');