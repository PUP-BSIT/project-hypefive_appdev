<?php

namespace App\Http\Controllers;

use App\Models\Students;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MembersController extends Controller {
  public function getMembers() {
    $students = DB::table('students')
      ->join('users', 'students.user_id', '=', 'users.id')
      ->join('icons', 'students.icon_id', '=', 'icons.id')
      //Get all student except superadmin
      ->where('students.id', '!=', 1)
      //Fetch students with an account_status of accepted
      ->where('users.account_status_id', 2)
      ->get(['students.*', 'users.email', 'icons.icon_location']);
    return response()->json($students, 200);
  }

  public function membershipRequest() {
    $students = DB::table('students')
      ->join('users', 'students.user_id', '=', 'users.id')
      ->join('icons', 'students.icon_id', '=', 'icons.id')
      //Get all student except superadmin
      ->where('students.id', '!=', 1)
      //Fetch students with an account_status of pending
      ->where('users.account_status_id', "=", 1)
      ->get(['students.*', 'icons.icon_location']);

    return response()->json($students, 200);
  }

  public function acceptMember(Request $request) {
    $student_number = $request->only('student_number');
    $user_id = DB::table('students')
      ->where('student_number', $student_number)
      ->value('user_id');

    $updateTime = now();
    if ($user_id) {
      DB::table('users')->where('id', $user_id)
        ->update(['account_status_id' => 2, 'updated_at' => $updateTime]);
        
      DB::table('students')->where('id', $user_id)
      ->update(['updated_at' => $updateTime]);

      $response['message'] = 'Student accepted successfully';
      $response['code'] = 200;
      return response()->json($response);
    } else {
      $response['message'] = 'User not found';
      $response['code'] = 404;
      return response()->json($response);
    }
  }

  public function declineMember(Request $request) {
    $student_number = $request->only('student_number');
    $user_id = DB::table('students')
      ->where('student_number', $student_number)
      ->value('user_id');
    
    $updateTime = now();
    if ($user_id) {
      DB::table('users')->where('id', $user_id)
        ->update(['account_status_id' => 3, 'updated_at' => $updateTime]);

      DB::table('students')->where('student_number', $student_number)
        ->update(['role_id' => 1, 'updated_at' => $updateTime]);

      $response['message'] = 'Student declined successfully';
      $response['code'] = 200;
      return response()->json($response);
    } else {
      $response['message'] = 'User not found';
      $response['code'] = 404;
      return response()->json($response);
    }
  }

  public function getOfficers() {
    $students = DB::table('students')
      ->join('users', 'students.user_id', '=', 'users.id')
      ->join('icons', 'students.icon_id', '=', 'icons.id')
      //Get all student except superadmin
      ->where('students.id', '!=', 1)
      ->where('students.role_id', '=', 2)
      //Fetch students with an account_status of accepted
      ->where('users.account_status_id', 2)
      ->get(['students.*', 'users.email', 'icons.icon_location']);
    return response()->json($students, 200);
  }

  public function promoteToOfficer(Request $request) {
    $student_number = $request->only('student_number');

    if ($student_number) {
      DB::table('students')->where('student_number', $student_number)
        ->update(['role_id' => 2]);

      $response['message'] = 'Student added as an officer';
      $response['code'] = 200;
      return response()->json($response);
    } else {
      $response['message'] = 'Member accepted successfully';
      $response['code'] = 404;
      return response()->json($response);
    }
  }

  public function demoteToMember(Request $request) {
    $student_number = $request->only('student_number');

    if ($student_number) {
      DB::table('students')->where('student_number', $student_number)
        ->update(['role_id' => 1]);

      $response['message'] = 'Student demoted to member';
      $response['code'] = 200;
      return response()->json($response);
    } else {
      $response['message'] = 'User not found';
      $response['code'] = 404;
      return response()->json($response);
    }
  }

}
