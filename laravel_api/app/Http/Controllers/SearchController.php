<?php

namespace App\Http\Controllers;

use App\Models\Students;
use Illuminate\Http\Request;
use App\Models\Events;
use App\Models\User;

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
    $keyword = $request->input('search_member');
    
    $query = Students::query()
      ->join('users', 'students.user_id', '=', 'users.id')
      ->where('users.is_active', 1); // Excluding student with id 1
    
    if ($keyword) {
        $query->where(function ($query) use ($keyword) {
            $query->whereRaw("students.first_name LIKE '%" . $keyword . "%'")
                  ->orWhereRaw("students.last_name LIKE '%" . $keyword . "%'");
        });
    }
    
    $results = $query->get();

    if ($results->isEmpty()) {
        $response['message'] = 'Student not found';
        $response['code'] = 404;
        return response()->json($response);
    }

    return $results;
  }


  public function searchEmail(Request $request) {
    $query = User::query();
    $keyword = $request->input('search_email');

    if ($keyword) {
      $query->whereRaw("email LIKE '%" . $keyword . "%' ");
    }

    $results = $query->get();

    if ($results->isNotEmpty()) {
      return response()->json('Email already exists');
    } 

  }

  public function searchStudentNumber(Request $request) {
    $query = Students::query();
    $keyword = $request->input('search_student_num');

    if ($keyword) {
      $query->whereRaw("student_number LIKE '%" . $keyword . "%' ");
    }

    $results = $query->get();

    if ($results->isNotEmpty()) {
      return response()->json('Student already exists');
    } 
  }
}
