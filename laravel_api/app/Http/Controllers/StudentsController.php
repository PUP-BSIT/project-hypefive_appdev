<?php

namespace App\Http\Controllers;

use App\Models\Students;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;
use Illuminate\Support\Facades\Mail;
use App\Mail\VerificationMail;
use App\Models\User;

class StudentsController extends Controller {
  public function register(Request $request) {
    $student = User::where('email', $request['email'])->first();

    $student_number = Students::where('student_number', 
      $request['student_number'])->first();

    $iconId = null;
    $createTime = now();
    if ($request->gender === 'female') {
      $iconId = rand(1, 6); // Random picker from 1 to 6 for females
    } elseif ($request->gender === 'male') {
      $iconId = rand(7, 10); // Random picker from 7 to 10 for males
    } else {
      $iconId = rand(1, 10); // Random picker from 1 to 10 for others
    }

    if ($student) {
      $response['status'] = 0;
      $response['message'] = 'Email already exists';
      $response['code'] = 409;
    } else if ($student_number) {
      $response['status'] = 0;
      $response['message'] = 'Student number already exists';
      $response['code'] = 409;
    } else {
      $verificationCode = Str::random(15);
      //Insert the data 
      $student = DB::table('users')->insertGetId([
        'email' => $request->email,
        'password' => bcrypt($request->password),
        'email_auth_token' => $verificationCode,
        'created_at' => $createTime
      ]);
      DB::table('students')->insert([
        'first_name' => $request->first_name,
        'last_name' => $request->last_name,
        'student_number' => $request->student_number,
        'birthday' => $request->birthday,
        'gender' => $request->gender,
        'user_id' => $student,
        'icon_id' => $iconId,
        'created_at' => $createTime
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
    } catch (JWTException $e) {
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
      'user_id' => $user->id,
      'email' => $user->email
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

  public function retrieve(Request $request, $id, $email) {
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
          'icon_id' => $student->icon_id
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

  public function updateIcon(Request $request) {
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

    $user_id = $user->id;

    $request->validate([
      'icon_id' => 'required|integer|'
    ]);

    $updated = Students::where('user_id', $user_id)->update(['icon_id' => $request->icon_id]);

    if ($updated) {
      return response()->json(['message' => 'Icon ID updated successfully'], 200);
    } else {
      return response()->json(['message' => 'Failed to update icon ID'], 500);
    }
  }

  public function getTotalMembers() {
    $members = DB::table('students')->whereNotIn('id', [1])->count();
    
    return response()->json($members);
  }
}
