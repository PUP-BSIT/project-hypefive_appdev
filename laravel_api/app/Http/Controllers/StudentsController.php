<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Students;
use Illuminate\Support\Facades\DB;

class StudentsController extends Controller
{
    //Get all students
    public function getStudents() {
        return response()->json(Students::all(), 200);
    }
}
