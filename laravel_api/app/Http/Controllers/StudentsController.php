<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Students;
use App\Models\Login;
use Illuminate\Support\Facades\DB;

class StudentsController extends Controller
{
    //Get all students
    public function getStudents() {
        return response()->json(Students::all(), 200);
    }

    public function getStudentsById($id) {
        $student = Students::find($id);

        if (is_null($student)) {
            return response()->json(['message'=>'Student not found'], 404);
        }
        return response()->json($student::find ($id), 200);
    }

    public function addStudent(Request $request) {
        //Insert the data and pass the id
        $student = DB::table('students')->insertGetId([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'student_number' => $request->student_number,
            'birthday' => $request->birthday,
            'gender' => $request->gender,
        ]);

        DB::table('login')->insert([
            'user_id' => $student,
            'email' => $request->email,
            'password' => $request->password,
        ]);

        return response()->json(['Student added successfully'], 200);
        
    }
}
