<?php

namespace App\Http\Controllers;

use App\Models\Students;
use Illuminate\Http\Request;
use App\Models\Events;

class SearchController extends Controller {
  public function searchArchive(Request $request) {
    $query = Events::query();
    $keyword = $request->input('search_archive');

    if ($keyword) {
      $query->whereRaw("event_name LIKE '%" . $keyword . "%' ");
    }
    $results = $query->get();

    if ($results->isEmpty()) {
      $response['message'] = 'Event not found';
      $response['code'] = 404;
      return response()->json($response);
    }

    return $results;
  }

  public function searchMember(Request $request) {
    $query = Students::query();
    $keyword = $request->input('search_member');
    if ($keyword) {
      $query->where('id', '!=', 1)
        ->whereRaw("first_name LIKE '%" . $keyword . "%' ")
        ->orWhereRaw("last_name LIKE '%" . $keyword . "%'");
    }
    $results = $query->where('id', '!=', 1)->get();

    if ($results->isEmpty()) {
      $response['message'] = 'Student not found';
      $response['code'] = 404;
      return response()->json($response);
    }

    return $results;
  }
}
