<?php

namespace App\Http\Controllers;
use App\Models\Announcement;
use Illuminate\Http\Request;

class Announce extends Controller
{
    public function getAnnouncements()
    {
        return Announcement::where('is_posted', 1)
            ->with('student') 
            ->get()
            ->map(function ($announcement) {
                return [
                    'id' => $announcement->id,
                    'subject' => $announcement->subject,
                    'content' => $announcement->content,
                    'recipient' => $announcement->recipient,
                    'created_at' => $announcement->created_at,
                    'author' => $announcement->student->first_name . ' ' . $announcement->student->last_name,
                ];
            });
    }

    public function createAnnouncement(Request $request)
    {
        $validatedData = $request->validate([
            'subject' => 'required|max:350',
            'recipient' => 'required|integer',
            'content' => 'required',
            'is_posted' => 'boolean',
            'student_id' => 'required|exists:students,user_id',
        ]);
    
        $announcement = Announcement::create($validatedData);
        $announcement->update(['is_posted' => 1]);
    
        $announcementId = $announcement->id;
        return response()->json([
            'announcement' => $announcement,
            'announcement_id' => $announcementId 
        ], 201);
    }

    public function show($id)
    {
        return Announcement::findOrFail($id);
    }

    public function updateAnnouncement(Request $request, $id)
    {
        $validatedData = $request->validate([
            'subject' => 'required|max:350',
            'recipient' => 'required|integer',
            'content' => 'required',
            'is_posted' => 'boolean',
            'student_id' => 'required|exists:students,user_id',
        ]);

        $announcement = Announcement::findOrFail($id);
        $announcement->update($validatedData);

        return response()->json($announcement, 200);
    }

    public function deleteAnnouncement($id)
    {
        $announcement = Announcement::findOrFail($id);
        $announcement->update(['is_posted' => 0]);
    
        return response()->json(null, 204);
    }
    
}
