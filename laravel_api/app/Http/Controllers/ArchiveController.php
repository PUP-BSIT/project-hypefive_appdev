<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ArchiveController extends Controller {
  public function getYearlyEvents() {
    $currentYear = Carbon::now()->year;

    $upcoming = DB::table('events')
      ->whereNotIn('event_state_id', [4])
      ->whereYear('date', '=', $currentYear)->orderBy('date', 'asc')->get();
    return response()->json($upcoming, 200);
  }

  public function getOldEvents() {
    $currentYear = Carbon::now()->year;

    $upcoming = DB::table('events')
      ->whereNotIn('event_state_id', [4])
      ->whereYear('date', '!=', $currentYear)->orderBy('date', 'asc')->get();
    return response()->json($upcoming, 200);
  }
}
