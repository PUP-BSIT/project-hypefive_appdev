<?php

namespace App\Http\Controllers;

use App\Models\Students;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MembersController extends Controller {
    //To do: VILLA-VILLA: Format response 
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
        $user_id = DB::table('students')->where('student_number', $student_number)->value('user_id');
    
        if ($user_id) {
            DB::table('users')->where('id', $user_id)->update(['account_status_id' => 2]);
            return response()->json(['message' => 'Account status updated successfully'], 200);
        } else {
            return response()->json(['message' => 'User not found'], 404);
        }
    }

    public function declineMember(Request $request) {
        $student_number = $request->only('student_number');
        $user_id = DB::table('students')->where('student_number', $student_number)->value('user_id');
        
        if ($user_id) {
            DB::table('users')->where('id', $user_id)->update(['account_status_id' => 3]);
            DB::table('students')->where('student_number', $student_number)->update(['role_id'=>1]);
            return response()->json(['message' => 'Student declined successfully'], 200);
        } else {
            return response()->json(['message' => 'User not found'], 404);
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

        if ($student_number){
            DB::table('students')->where('student_number', $student_number)->update(['role_id'=>2]);
            return response()->json(['message' => 'Student added as officer'], 200);
        } else {
            return response()->json(['message' => 'User not found'], 404);
        }
    }

    public function demoteToMember(Request $request) {
        $student_number = $request->only('student_number');

        if ($student_number){
            DB::table('students')->where('student_number', $student_number)->update(['role_id'=>1]);
            return response()->json(['message' => 'Student demoted to member'], 200);
        } else {
            return response()->json(['message' => 'User not found'], 404);
        }
    }

}
