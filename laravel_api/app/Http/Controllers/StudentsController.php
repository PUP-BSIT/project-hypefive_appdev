<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

use App\Models\Students;
use App\Models\Login;

class StudentsController extends Controller
{
    public function register(Request $request) {
        $student= Login::where ('email', $request['email'])->first();
         
        if ($student) {
            $response['status'] = 0;
            $response['message'] = 'Email already exists';
            $response['code'] = 409;
        } else {
            //Insert the data 
            $student = DB::table('students')->insertGetId([
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'student_number' => $request->student_number,
                'birthday' => $request->birthday,
                'gender' => $request->gender,
            ]);
            DB::table('logins')->insert([
                'user_id' => $student,
                'email' => $request->email,
                'password' => bcrypt($request->password) ,
            ]);

            $response['status']=1;
            $response['message'] = 'User registered successfully';
            $response['code'] = 200;
        }
        return response()->json($response);
    }
}
