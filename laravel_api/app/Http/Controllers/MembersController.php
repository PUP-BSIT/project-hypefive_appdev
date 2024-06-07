<?php

namespace App\Http\Controllers;

use App\Models\Students;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MembersController extends Controller {
    public function getMembers() {
        $students = DB::table('students')
            ->join('users', 'students.user_id', '=', 'users.id')
            //Get all student except superadmin
            ->where('students.id', '!=', 1) 
            //Fetch students with an account_status of accepted
            ->where('users.account_status_id', 2) 
            ->get(['students.*', 'users.email']);
        return response()->json($students, 200);
    }

    public function membershipRequest() {
        $students = DB::table('students')
        ->join('users', 'students.user_id', '=', 'users.id')
        //Get all student except superadmin
        ->where('students.id', '!=', 1) 
        //Fetch students with an account_status of pending
        ->where('users.account_status_id', 1) 
        ->get(['students.*']);
    return response()->json($students, 200);
    }
}
