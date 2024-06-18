<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Events;

class SearchController extends Controller
{
    //
    public function searchArchive(Request $request){
        $query = Events::query();
        $keyword = $request->input('search_archive');
        if($keyword){
            $query->whereRaw("event_name LIKE '%". $keyword ."%' ");
        } 
        $results = $query->get();

        if ($results->isEmpty()) {
            $response ['message'] = 'Event not found';
            $response ['code'] = 404;
            return response()->json($response);
        }

        return $results;
    }
}
