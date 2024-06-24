<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class FreedomWallController extends Controller {

    public function getPosts() {
        $posts = DB::table('freedomwall')->where('is_posted', 1)->where('accessibility', 1)->get();  //update to status
        return response()->json($posts, 200);
    }
    
    public function createPostFW(Request $request) {
        $post = $request->only('subject', 'content', 'background_color', 'accessibility');

    if ($post) {
      DB::table('freedomwall')->insert($post);
      $response['message'] = 'Post submitted successfully';
      $response['code'] = 200;
      return response()->json($response);
    } else {
      $response['message'] = 'Failed to post';
      $response['code'] = 404;
      return response()->json($response);
    }
  }

  public function deletePost(Request $request) {
    $postId = $request->only('id');
    $updatePost = now();
    if ($postId) {
      DB::table('freedomwall')->where('id', $postId)
        ->update(['is_posted' => 0, 'updated_at'=> $updatePost]);
      $response['message'] = 'Post successfully deleted.';
      $response['code'] = 200;
      return response()->json($response);
    } else {
      $response['message'] = 'Failed to delete post.';
      $response['code'] = 404;
      return response()->json($response);
    }
  }

    public function getPostRequest(){
      $posts = DB::table('freedomwall')->where('is_posted', 1)->where('accessibility', 0)->get();  //update to status
      return response()->json($posts, 200);
    }

    public function acceptPost(Request $request) {
      $postId = $request->only('id');
      $updateTime = now();
      if ($postId) {
        DB::table('freedomwall')->where('id', $postId)->update(['accessibility'=> 1 ,'updated_at'=>$updateTime ]);
        $response ['message'] = 'Post accepted successfully.';
        $response ['code'] = 200;
        return response()->json($response);
      } else {
        $response ['message'] = 'Failed to accept post.';
        $response ['code'] = 404;
        return response()->json($response);
      }
    }

    public function declinePost(Request $request) {
      $postId = $request->only('id');
      $updateTime = now();
      if ($postId) {
        DB::table('freedomwall')->where('id', $postId)->update(['accessibility'=> 3 ,'updated_at'=> $updateTime ]);
        $response ['message'] = 'Post declined successfully.';
        $response ['code'] = 200;
        return response()->json($response);
      } else {
        $response ['message'] = 'Failed to decline post.';
        $response ['code'] = 404;
        return response()->json($response);
      }
    }


}
