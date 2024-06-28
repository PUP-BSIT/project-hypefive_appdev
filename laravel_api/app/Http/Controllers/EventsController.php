<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Events;

class EventsController extends Controller {

  public function createEvent(Request $request) {
    $event = $request->only(
      'event_name', 'location', 'date', 'time', 'all_members_required',
      'has_reg_fee', 'registration_fee', 'max_attendees', 'caption',
      'poster_loc', 'event_status_id');

      if ($request->hasFile('poster_loc')) {
        // $events = new Events;
        $completeFileName = $request->file('poster_loc')->getClientOriginalName(); //Get the full file name
        $fileNameOnly = pathinfo($completeFileName, PATHINFO_FILENAME); //only the name of the file with no file extension
        $fileExtension = $request->file('poster_loc')->getClientOriginalExtension(); // get the file extension
        $newFileName = str_replace(' ', '_', $fileNameOnly).'-'.rand().'_'.time().'.'.$fileExtension;//replace the spaces on the filename with _
        
        $path = $request->file('poster_loc')->storeAs('public/images/event_poster', $newFileName); //php artisan storage:link

        $event['poster_loc'] = $newFileName;
      }

    $event['created_at'] = now();
    
    if ($event) {
      DB::table('events')->insert($event);
      $response['message'] = 'Event submitted successfully';
      $response['code'] = 200;
      return response()->json($response);
    } else {
      $response['message'] = 'Failed';
      $response['code'] = 404;
      return response()->json($response);
    }
  }

  public function getUpcomingEvents() {
    $upcoming = DB::table('events')->where('event_status_id', '=', 2)
      ->where('event_state_id', '=', 1)
      ->whereNotIn('event_state_id', [4])->orderBy('date', 'desc')->get();
    return response()->json($upcoming, 200);
  }

  public function getDraftEvents() {
    $upcoming = DB::table('events')->where('event_status_id', '=', 1)
      ->whereNotIn('event_state_id', [4])->orderBy('date', 'desc')->get();
    return response()->json($upcoming, 200);
  }

  public function getOccuringEvents() {
    $upcoming = DB::table('events')->where('event_status_id', '=', 2)
      ->where('event_state_id', '=', 2)
      ->whereNotIn('event_state_id', [4])->orderBy('date', 'desc')->get();
    return response()->json($upcoming, 200);
  }

  public function markAsOccuring(Request $request) {
    $updateState = $request->only('id');

    if ($updateState) {
      DB::table('events')->where('id', $updateState)
        ->update(['event_state_id' => 2, 'updated_at' => now()]);
      $response['message'] = 'Event state updated successfully';
      $response['code'] = 200;
      return response()->json($response);
    } else {
      $response['message'] = 'Failed to update';
      $response['code'] = 400;
      return response()->json($response);
    }
  }

  public function markAsComplete(Request $request) {
    $updateState = $request->only('id');

    if ($updateState) {
      DB::table('events')->where('id', $updateState)
        ->update(['event_state_id' => 3, 'updated_at' => now()]);
      $response['message'] = 'Event state updated successfully';
      $response['code'] = 200;
      return response()->json($response);
    } else {
      $response['message'] = 'Failed to update';
      $response['code'] = 400;
      return response()->json($response);
    }
  }

  public function publishDraft(Request $request) {
    $updateState = $request->only('id');

    if ($updateState) {
      DB::table('events')->where('id', $updateState)
        ->update([
          'event_state_id' => 1,
          'event_status_id' => 2,
          'updated_at' => now()
        ]);
      $response['message'] = 'Event state updated successfully';
      $response['code'] = 200;
      return response()->json($response);
    } else {
      $response['message'] = 'Failed to update';
      $response['code'] = 400;
      return response()->json($response);
    }
  }

  public function cancelEvent(Request $request) {
    $cancelEvent = $request->only('id');

    if ($cancelEvent) {
      DB::table('events')->where('id', $cancelEvent)
        ->update(['event_state_id' => 4, 'updated_at' => now()]);
      $response['message'] = 'Event canceled updated successfully';
      $response['code'] = 200;
      return response()->json($response);
    } else {
      $response['message'] = 'Failed to cancel';
      $response['code'] = 400;
      return response()->json($response);
    }
  }

  public function updateEvent(Request $request) {
    $updateDetails = $request->only(
      'event_name', 'location', 'date', 'time', 'all_members_required',
      'has_reg_fee', 'registration_fee', 'max_attendees', 'caption',
      'poster_loc', 'event_status_id');
    if ($request->hasFile('poster_loc')) {
        $completeFileName = $request->file('poster_loc')->getClientOriginalName(); //Get the full file name
        $fileNameOnly = pathinfo($completeFileName, PATHINFO_FILENAME); //only the name of the file with no file extension
        $fileExtension = $request->file('poster_loc')->getClientOriginalExtension(); // get the file extension
        $newFileName = str_replace(' ', '_', $fileNameOnly).'-'.rand().'_'.time().'.'.$fileExtension;//replace the spaces on the filename with _
        
        $path = $request->file('poster_loc')->storeAs('public/images/event_poster', $newFileName); //php artisan storage:link

        $updateDetails['poster_loc'] = $newFileName;
    }
    
    $updateDetails['updated_at'] = now();
    $updateId = $request->id;

    if($updateDetails['has_reg_fee'] === 0){
      $updateDetails['registration_fee'] = 0;
    }

    if ($updateDetails) {
      DB::table('events')->where('id', $updateId)->update($updateDetails);
      $response['message'] = 'Event updated successfully';
      $response['code'] = 200;
      return response()->json($response);
    } else {
      $response['message'] = 'Failed to update';
      $response['code'] = 400;
      return response()->json($response);
    }
  }

  public function getTotalUpcomingEvents(){
    $eventCount = DB::table('events')->where('event_status_id', '=', 2)
      ->where('event_state_id', '=', 1)
      ->whereNotIn('event_state_id', [4])->count();
    
    return response()->json($eventCount);
  }

  public function getFiveEvents() {
    $events = DB::table('events')
      ->where('event_status_id', '=', 2)
      ->where('event_state_id', '=', 1)
      ->whereNotIn('event_state_id', [4])
      ->limit(5)->get(); 
    return response()->json($events);
  }
}
