<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Models\User;
use Illuminate\Support\Facades\Redirect;

class EmailVerificationController extends Controller {
    public function verify(Request $request) {
        $token = $request->query('token');

        try {
            $user = JWTAuth::parseToken()->authenticate();
            $user->email_verified_at = now();
            $user->save();
            return Redirect::to('/login?verified=1'); // Redirect to Angular login page
        } catch (\Exception $e) {
            return Redirect::to('/login?verified=0'); // Redirect with error
        }
    }
}
