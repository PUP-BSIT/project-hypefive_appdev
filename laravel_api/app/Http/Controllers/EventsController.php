<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class EventsController extends Controller
{
    public function createEvent(Request $request) {
        $event = $request->only('event_name', 'location', 'date', 'time', 
            'all_members_required', 'has_reg_fee', 'registration_fee',
            'max_attendees', 'caption','poster_loc', 'event_status_id');

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
    //event_state = 1 with status of 2
    public function getUpcomingEvents() {
        $upcoming = DB::table('events')->where('event_state_id', '=', 1)
        ->where('event_status_id', '=', 2)->get();
        return response()->json($upcoming, 200);
    }

    public function getDraftEvents() {
        $upcoming = DB::table('events')->where('event_state_id', '=', 1)
        ->where('event_status_id', '=', 1)->get();
        return response()->json($upcoming, 200);
    }

    public function getRecurringEvents() {
        $upcoming = DB::table('events')->where('event_state_id', '=', 2)
        ->where('event_status_id', '=', 2)->get();
        return response()->json($upcoming, 200);
    }
}
