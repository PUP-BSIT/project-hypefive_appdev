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
}
