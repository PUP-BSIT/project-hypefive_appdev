<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use Illuminate\Support\Facades\Mail;
use App\Mail\VerificationMail;
use App\Models\User;

class StudentsController extends Controller {
    public function register(Request $request) {
        $student= User::where ('email', $request['email'])->first();
         
        if ($student) {
            $response['status'] = 0;
            $response['message'] = 'Email already exists';
            $response['code'] = 409;
        } else {
            $verificationCode = Str::random(15);
            //Insert the data 
            $student = DB::table('users')->insertGetId([
                'email' => $request->email,
                'password' => bcrypt($request->password),
                'email_auth_token' => $verificationCode,
            ]);
            DB::table('students')->insertGetId([
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'student_number' => $request->student_number,
                'birthday' => $request->birthday,
                'gender' => $request->gender,
                'user_id' => $student,
            ]);
            $student = User::find($student);
            $this->sendVerificationEmail($student);
            
            $response['status'] = 1;
            $response['message'] = 
                'User registered successfully, please wait for the approval';
            $response['code'] = 200;
        }
        return response()->json($response);
    }

    public function login(Request $request) {
        $credentials = $request->only('email', 'password');

        try {
            if (!JWTAuth::attempt($credentials)) {
                $response['status'] = 0;
                $response['code'] = 401;
                $response['data'] = null;
                $response['message'] = 'Email or password is incorrect';

                return response()->json($response);
            }
        } catch(JWTException $e){
            $response['data'] = null;
            $response['code'] = 500;
            $response['message'] = 'Could not create token';

            return response()->json($response);
        }
        
        $user = auth()->user();

        // Check the account status of the user
        if ($user->account_status_id != 2) {
            $response['status'] = 0;
            $response['code'] = 401;
            $response['message'] = 'Please wait for the confirmation';
            return response()->json($response);
        }

        $data['token'] = auth()->claims([
            'user_id'=>$user->id,
            'email' =>$user->email
        ])->attempt($credentials);

        $response['data'] = $data;
        $response['status'] = 1;
        $response['code'] = 200;
        $response['message'] = 'Login successful';

        return response()->json($response);
    }

    public function sendVerificationEmail($student) {
        $verificationCode = $student->email_auth_token;
        
        Mail::to($student->email)->send(new VerificationMail($verificationCode));
    }
    
}
