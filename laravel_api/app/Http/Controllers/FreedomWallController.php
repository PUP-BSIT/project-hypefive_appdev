<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Crypt;

class FreedomWallController extends Controller
{

  public function getPosts()
  {
    $posts = DB::table('freedomwall')->where('is_posted', 1)->where('post_status_id', 2)->get();  //update to status
    foreach ($posts as $post) {
      $post->student_id = Crypt::decrypt($post->student_id);
    }
    return response()->json($posts, 200);
  }

  public function createPostFW(Request $request)
  {
    $post = $request->only('subject', 'content', 'background_color', 'post_status_id', 'student_id', );

    $post['student_id'] = Crypt::encrypt($request->student_id);
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

  public function deletePost(Request $request)
  {
    $postId = $request->only('id');
    $updatePost = now();
    if ($postId) {
      DB::table('freedomwall')->where('id', $postId)
        ->update(['is_posted' => 0, 'updated_at' => $updatePost]);
      $response['message'] = 'Post successfully deleted.';
      $response['code'] = 200;
      return response()->json($response);
    } else {
      $response['message'] = 'Failed to delete post.';
      $response['code'] = 404;
      return response()->json($response);
    }
  }

  public function getPostRequest()
  {
    $posts = DB::table('freedomwall')->where('is_posted', 1)->where('post_status_id', 1)->get();  //update to status
    return response()->json($posts, 200);
  }

  public function acceptPost(Request $request)
  {
    $postId = $request->only('id');
    $updateTime = now();
    if ($postId) {
      DB::table('freedomwall')->where('id', $postId)->update(['post_status_id' => 2, 'updated_at' => $updateTime]);
      $response['message'] = 'Post accepted successfully.';
      $response['code'] = 200;
      return response()->json($response);
    } else {
      $response['message'] = 'Failed to accept post.';
      $response['code'] = 404;
      return response()->json($response);
    }
  }

  public function declinePost(Request $request)
  {
    $postId = $request->only('id');
    $updateTime = now();
    if ($postId) {
      DB::table('freedomwall')->where('id', $postId)->update(['post_status_id' => 3, 'updated_at' => $updateTime]);
      $response['message'] = 'Post declined successfully.';
      $response['code'] = 200;
      return response()->json($response);
    } else {
      $response['message'] = 'Failed to decline post.';
      $response['code'] = 404;
      return response()->json($response);
    }
  }

  public function getDeletionRequests()
  {
    $posts = DB::table('freedomwall')
      ->where('is_posted', 1)
      ->where('post_status_id', 2)
      ->where('is_deletion_requested', 1)
      ->orderBy('deletion_req_count', 'DESC')->get();
    return response()->json($posts, 200);
  }

  public function deletionRequest(Request $request)
  {
    $postId = $request->only('id');
    $updateTime = now();

    $delReqCount = DB::table('freedomwall')->where('id', $postId)->value('deletion_req_count');
    if ($postId) {
      DB::table('freedomwall')->where('id', $postId)
        ->update(['is_deletion_requested' => 1, 'updated_at' => $updateTime, 'deletion_req_count' => $delReqCount + 1]);
      $response['message'] = 'Request sent successfully.';
      $response['code'] = 200;
      return response()->json($response);
    } else {
      $response['message'] = 'Request failed.';
      $response['code'] = 200;
      return response()->json($response);
    }
  }

  public function declineDeletionRequest(Request $request)
  {
    $postId = $request->only('id');
    $updateTime = now();

    if ($postId) {
      DB::table('freedomwall')->where('id', $postId)
        ->update(['is_deletion_requested' => 0, 'updated_at' => $updateTime]);
      $response['message'] = 'Request declined successfully .';
      $response['code'] = 200;
      return response()->json($response);
    } else {
      $response['message'] = 'Failed to decline request.';
      $response['code'] = 404;
      return response()->json($response);
    }
  }

  public function getTotalPendingPosts() {
    $post =  DB::table('freedomwall')->where('is_posted', 1)
      ->where('post_status_id', 1)->count();
    return response()->json($post);
  }
}
