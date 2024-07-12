<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ArchiveController extends Controller {
  // protected $imgPath = 'http://127.0.0.1:8000/storage/images/event_poster/'; 
  protected $imgPath = 'https://orgbee.online/storage1/images/event_poster/'; 
  public function getYearlyEvents() {
    $currentYear = Carbon::now()->year;

    $upcoming = DB::table('events')
      ->whereNotIn('event_state_id', [4])
      ->whereYear('date', '=', $currentYear)->orderBy('date', 'asc')->get();
    foreach ($upcoming as $event) {
      $event->poster_loc = $this->imgPath . $event->poster_loc;
    }
    return response()->json($upcoming, 200);
  }

  public function getOldEvents() {
    $currentYear = Carbon::now()->year;

    $upcoming = DB::table('events')
      ->whereNotIn('event_state_id', [4])
      ->whereYear('date', '!=', $currentYear)->orderBy('date', 'asc')->get();
    foreach ($upcoming as $event) {
      $event->poster_loc = $this->imgPath . $event->poster_loc;
    }
    return response()->json($upcoming, 200);
  }
}
