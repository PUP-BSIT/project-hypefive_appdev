<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class FreedomWallController extends Controller
{
    public function getPosts() {
        $posts = DB::table('freedomwall')->get(); 
        return response()->json($posts, 200);
    }
    
    public function createPostFW(Request $request) {
        $post = $request->only('subject', 'content', 'background_color');

        if ($post) {
            DB::table('freedomwall')->insert($post);
            return response()->json(['message'=>'Posted'], 200);
        } else {
            return response()->json(['message' => 'Not posted'], 404);
        } 
    }

}
