<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Events;

class EventRegisterController extends Controller {
  public function registerEvent(Request $request) {
    $register = $request->only('event_id', 'student_id');

    if ($register) {
      DB::table('registrations')->insert([
        'event_id' => $register['event_id'],
        'student_id' => $register['student_id']
      ]);
      $event = Events::find($request->event_id);
      // Increment the reg_count for the event
      $event->reg_count += 1;
      $event->save();
      $response['message'] = 'Registered successfully!';
      $response['code'] = 200;
      return response()->json($response);
    } else {
      $response['message'] = 'Registration failed';
      $response['code'] = 404;
      return response()->json($response);
    }
  }

  public function checkRegistration(Request $request) {
    $check = $request->only('event_id', 'student_id');

    if ($check) {
      $registrationExists = DB::table('registrations')
        ->where('event_id', $request->event_id)
        ->where('student_id', $request->student_id)->first();
    }

    if ($registrationExists) {
      if ($registrationExists->is_registered == 0) {
        return response()->json(2); // for re registration
      }
      return response()->json(1); //data exists
    } else {
      return response()->json(0);
    }
  }

  public function unregisterEvent(Request $request) {
    $register = $request->only('event_id', 'student_id');

    if ($register) {
      DB::table('registrations')->where('event_id', $register['event_id'])
        ->where('student_id', $register['student_id'])
        ->update(['is_registered' => 0]);

      $event = Events::find($request->event_id);
      // Increment the reg_count for the event
      $event->reg_count -= 1;
      $event->save();
      $response['message'] = 'Unregistered successfully!';
      $response['code'] = 200;
      return response()->json($response);
    } else {
      $response['message'] = 'Unregistration failed';
      $response['code'] = 404;
      return response()->json($response);
    }
  }

  public function reRegisterEvent(Request $request) {
    $register = $request->only('event_id', 'student_id');

    if ($register) {
      DB::table('registrations')->where('event_id', $register['event_id'])
        ->where('student_id', $register['student_id'])
        ->update(['is_registered' => 1]);

      $event = Events::find($request->event_id);
      // Increment the reg_count for the event
      $event->reg_count += 1;
      $event->save();
      $response['message'] = 'Re-registration successful!';
      $response['code'] = 200;
      return response()->json($response);
    } else {
      $response['message'] = 'Re-registration failed';
      $response['code'] = 404;
      return response()->json($response);
    }
  }
}
