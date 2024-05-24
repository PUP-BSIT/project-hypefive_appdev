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

    public function getStudentsById($id){
        $student = Students::find($id);

        if (is_null($student)){
            return response()->json(['message'=>'Employee not Found'], 404);
        }
        return response()->json($student::find ($id), 200);
    }
}
