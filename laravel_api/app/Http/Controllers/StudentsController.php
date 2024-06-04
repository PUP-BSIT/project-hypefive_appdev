<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;
use App\Models\Students;
use App\Models\User;

class StudentsController extends Controller
{
    public function register(Request $request) {
        $student= User::where ('email', $request['email'])->first();
         
        if ($student) {
            $response['status'] = 0;
            $response['message'] = 'Email already exists';
            $response['code'] = 409;
        } else {
            //Insert the data 
            $student = DB::table('users')->insertGetId([
                'email' => $request->email,
                'password' => bcrypt($request->password) ,
            ]);
            DB::table('students')->insertGetId([
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'student_number' => $request->student_number,
                'birthday' => $request->birthday,
                'gender' => $request->gender,
                'user_id' => $student,
            ]);
            
            $response['status']=1;
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
                $response['data']=null;
                $response['message'] = 'Email or password is incorrect';

                return response()->json($response);
            }
        } catch(JWTException $e){
            $response['data']=null;
            $response['code']= 500;
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

    public function retrieve(Request $request, $id, $email)
{
    try {
        // Verify JWT token
        $user = JWTAuth::parseToken()->authenticate();
    } catch (TokenExpiredException $e) {
        return response()->json(['message' => 'Token expired'], 401);
    } catch (TokenInvalidException $e) {
        return response()->json(['message' => 'Token invalid'], 401);
    } catch (JWTException $e) {
        return response()->json(['message' => 'Token absent'], 401);
    }

    // Check if the user's ID and email match the parameters
    if ($user->id == $id && $user->email == $email) {
        // Retrieve student and user information based on user_id
        $student = Students::where('user_id', $id)->first();
        $userInfo = User::where('email', $email)->first();

        if ($student && $userInfo) {
            return response()->json([
                'first_name' => $student->first_name,
                'last_name' => $student->last_name,
                'email' => $userInfo->email,
                'student_number' => $student->student_number,
                'birthday' => $student->birthday,
                'gender' => $student->gender,
                'user_id' => $student->user_id,
                'role_id' => $student->role_id, 
                'account_status_id' => $student->account_status_id, 
            ]);
        } else {
            // Student or user not found
            return response()->json(['message' => 'Student or user not found'], 404);
        }
    } else {
        // Unauthorized access
        return response()->json(['message' => 'Unauthorized'], 403);
    }
}
    }
    
    


