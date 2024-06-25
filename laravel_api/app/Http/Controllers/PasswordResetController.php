<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Carbon\Carbon;
use App\Mail\ForgotPasswordMail;
use App\Models\User;

class PasswordResetController extends Controller
{
    public function sendResetLinkEmail(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['success' => false, 'message' => 'User not found'], 404);
        }

        $token = Str::random(6);

        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $request->email],
            ['token' => $token, 'created_at' => Carbon::now()]
        );

        Mail::to($request->email)->send(new ForgotPasswordMail($token));

        return response()->json(['success' => true, 'message' => 'Password reset link sent']);
    }

    public function verifyToken(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'token' => 'required',
        ]);
    
        $passwordReset = DB::table('password_reset_tokens')
            ->where('token', $request->token)
            ->where('email', $request->email)
            ->first();
    
        if (!$passwordReset) {
            return response()->json(['success' => false, 'message' => 'Invalid token or email'], 400);
        }
    
        return response()->json(['success' => true, 'message' => 'Token verified']);
    }
    

    public function reset(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|confirmed|min:8',
        ]);
    
        $user = User::where('email', $request->email)->first();
    
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'User not found'], 404);
        }
    
        $user->password = Hash::make($request->password);
        $user->save();
    
        // Optionally, delete the password reset token after successful reset
        DB::table('password_reset_tokens')->where('email', $request->email)->delete();
    
        return response()->json(['success' => true, 'message' => 'Password reset successfully']);
    }
    
}
