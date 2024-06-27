<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Models\User;
use Illuminate\Support\Facades\Redirect;

class EmailVerificationController extends Controller {
  public function verify(Request $request) {
      try {
          $token = $request->input('token');
          $user = User::where('email_auth_token', $token)->first();

          if ($user) {
              $user->is_verified = 1;
              $user->email_auth_token = null; // Assuming this is the correct column name
              $user->save();
              return response()->json(['message' => 'Email verified successfully'], 200);
          } else {
              return response()->json(['message' => 'Invalid verification token'], 400);
          }
      } catch (\Exception $e) {
          \Log::error('Verification Error: ' . $e->getMessage());
          return response()->json(['message' => 'Internal Server Error'], 500);
      }
  }
}
