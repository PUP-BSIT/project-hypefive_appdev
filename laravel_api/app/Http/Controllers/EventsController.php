<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class EventsController extends Controller
{
    //TO DO: VILLA-VILLA: Format response
    public function createEvent(Request $request) {
        $event = $request->only('event_name', 'location', 'date', 'time', 
            'all_members_required', 'has_reg_fee', 'registration_fee',
            'max_attendees', 'caption','poster_loc', 'event_status_id');
        $event['created_at'] = now();

        if ($event) {
            DB::table('events')->insert($event);
            $response ['message'] = 'Event submitted successfully';
            $response ['code'] = 200;
            return response()->json($response);
        } else {
            $response ['message'] = 'Failed';
            $response ['code'] = 404;
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
                ->update(['event_state_id'=>2, 'updated_at' => now()]);
            $response ['message'] = 'Event state updated successfully';
            $response ['code'] = 200;
            return response()->json($response);
        } else{
            $response ['message'] = 'Failed to update';
            $response ['code'] = 400;
            return response()->json($response);
        }
    }

    public function markAsComplete(Request $request) {
        $updateState = $request->only('id');

        if ($updateState) {
            DB::table('events')->where('id', $updateState)
                ->update(['event_state_id'=>3, 'updated_at' => now()]);
            $response ['message'] = 'Event state updated successfully';
            $response ['code'] = 200;
            return response()->json($response);
        } else{
            $response ['message'] = 'Failed to update';
            $response ['code'] = 400;
            return response()->json($response);
        }
    }

    public function publishDraft(Request $request) {
        $updateState = $request->only('id');

        if ($updateState) {
            DB::table('events')->where('id', $updateState)
                ->update(['event_state_id'=>1, 
                'event_status_id'=>2, 
                'updated_at' => now()]);
            $response ['message'] = 'Event state updated successfully';
            $response ['code'] = 200;
            return response()->json($response);
        } else{
            $response ['message'] = 'Failed to update';
            $response ['code'] = 400;
            return response()->json($response);
        }
    }

    public function cancelEvent(Request $request) {
        $cancelEvent = $request->only('id');

        if ($cancelEvent) {
            DB::table('events')->where('id', $cancelEvent)
                ->update(['event_state_id'=>4, 'updated_at' => now()]);
            $response ['message'] = 'Event canceled updated successfully';
            $response ['code'] = 200;
            return response()->json($response);
        } else{
            $response ['message'] = 'Failed to cancel';
            $response ['code'] = 400;
            return response()->json($response);
        }
    }

    public function updateEvent(Request $request) {
        $updateDetails = $request->only('id','event_name', 'location', 'date', 'time', 
            'all_members_required', 'has_reg_fee', 'registration_fee',
            'max_attendees', 'caption','poster_loc', 'event_status_id');
        $updateDetails['updated_at'] = now();
        $updateId = $request->id;

        if($updateDetails) {
            DB::table('events')->where('id', $updateId)->update($updateDetails);
            $response ['message'] = 'Event updated successfully';
            $response ['code'] = 200;
            return response()->json($response);
        } else {
            $response ['message'] = 'Failed to update';
            $response ['code'] = 400;
            return response()->json($response);
        }
    }
}
