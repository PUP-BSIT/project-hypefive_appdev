<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class EventRegisterController extends Controller
{
    //

    public function registerEvent(Request $request) {
      $register = $request->only('event_id', 'student_id');

      if($register){
        DB::table('registrations')->insert([
          'event_id' => $register['event_id'],
          'student_id' => $register['student_id']
      ]);
        return response()->json('Registered successfully');
      } else{
        return response()->json('Registered failed');
      }
    }

    public function checkRegistration (Request $request) {
      $check = $request->only('event_id', 'student_id');

      if($check){
        $registrationExists = DB::table('registrations')->where('event_id', $request->event_id)
        ->where('student_id', $request->student_id)->exists();
      } 

      if($registrationExists) {
        return response()->json(1); //data exists
      } else {
        return response()->json(0);
      }
    }
}
