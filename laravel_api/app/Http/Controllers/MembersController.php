<?php

namespace App\Http\Controllers;

use App\Models\Students;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Mail\MemberAccepted;
use Illuminate\Support\Facades\Mail;

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
      ->where('users.is_verified', true)
      ->get(['students.*', 'icons.icon_location']);

    return response()->json($students, 200);
  }

  public function acceptMember(Request $request) {
    $student_number = $request->input('student_number');
    $user_id = DB::table('students')
      ->where('student_number', $student_number)
      ->value('user_id');

    if (!$user_id) {
      return response()->json(['message' => 'User not found', 'code' => 404]);
    }

    $updateTime = now();
    DB::table('users')->where('id', $user_id)
      ->update(['account_status_id' => 2, 'updated_at' => $updateTime]);

    DB::table('students')->where('student_number', $student_number)
      ->update(['updated_at' => $updateTime]);

    $user = DB::table('users')
      ->join('students', 'users.id', '=', 'students.user_id')
      ->where('students.student_number', $student_number)
      ->first(['users.email', 'students.first_name']);

    $statusMessage = 'Congratulations! Your membership request has been accepted.';
    Mail::to($user->email)->send(new MemberAccepted($user, $statusMessage));

    $response = [
      'message' => 'Student accepted successfully',
      'code' => 200
    ];

    return response()->json($response);
  }

  public function declineMember(Request $request) {
    $student_number = $request->input('student_number');
    $user_id = DB::table('students')
        ->where('student_number', $student_number)
        ->value('user_id');

      if (!$user_id) {
        return response()->json(['message' => 'User not found', 'code' => 404]);
      }

      $updateTime = now();
      DB::table('users')->where('id', $user_id)
        ->update(['account_status_id' => 3, 'updated_at' => $updateTime]);

      DB::table('students')->where('student_number', $student_number)
        ->update(['role_id' => 1, 'updated_at' => $updateTime]);

      $user = DB::table('users')
        ->join('students', 'users.id', '=', 'students.user_id')
        ->where('students.student_number', $student_number)
        ->first(['users.email', 'students.first_name']);

      $statusMessage = 'Unfortunately, your membership request has been declined.';
      Mail::to($user->email)->send(new MemberAccepted($user, $statusMessage));

      $response = [
        'message' => 'Student declined successfully',
        'code' => 200
      ];

      return response()->json($response);
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
    $student_number = $request->input('student_number');

    if ($student_number) {
        DB::table('students')->where('student_number', $student_number)
            ->update(['role_id' => 2]);

        $user = DB::table('users')
            ->join('students', 'users.id', '=', 'students.user_id')
            ->where('students.student_number', $student_number)
            ->first(['users.email', 'students.first_name']);

        $statusMessage = 'You have been promoted to an officer.';

        Mail::to($user->email)->send(new MemberAccepted($user, $statusMessage));

        $response['message'] = 'Student added as an officer';
        $response['code'] = 200;
        return response()->json($response);
    } else {
        $response['message'] = 'Member not found';
        $response['code'] = 404;
        return response()->json($response);
    }
}

  public function demoteToMember(Request $request) {
    $student_number = $request->input('student_number');

    if ($student_number) {
        DB::table('students')->where('student_number', $student_number)
            ->update(['role_id' => 1]);

        $user = DB::table('users')
            ->join('students', 'users.id', '=', 'students.user_id')
            ->where('students.student_number', $student_number)
            ->first(['users.email', 'students.first_name']);

        $statusMessage = 'You have been demoted to a member.';

        Mail::to($user->email)->send(new MemberAccepted($user, $statusMessage));

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
