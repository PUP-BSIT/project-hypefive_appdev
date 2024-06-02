<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

//Get all students
Route::get('/students', [\App\Http\Controllers\StudentsController::class, 
                             'getStudents'])->name('api.students');

//Get students by Id
Route::get('/students/{id}', [\App\Http\Controllers\StudentsController::class, 
                                'getStudentsById'])->name('api.students');

//Add new student
Route::post('/addStudent', [\App\Http\Controllers\StudentsController::class, 
                                'addStudent'])->name('api.new-student');