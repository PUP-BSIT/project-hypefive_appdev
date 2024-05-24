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
            return response()->json(['message'=>'Employee not Found'], 404);
        }
        return response()->json($student::find ($id), 200);
    }

    public function addStudent(Request $request) {
        //Insert the data and pass the id
        $student = DB::table('students')->insertGetId([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'email' => $request->email,
            'birthday' => $request->birthday,
            'gender' => $request->gender,
        ]);

        DB::table('login')->insert([
            'user_id' => $student,
            'student_number' => $request->student_number,
            'password' => $request->password,
        ]);

        return response()->json(['Student added successfully'], 404);
        
    }
}
