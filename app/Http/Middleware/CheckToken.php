<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Redirect;

class CheckToken {
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        /// Retrieve the token from local storage
        $token = $request->cookie('XSRF-TOKEN');
        // Check if the token exists
        if ($token) {
            if ($request->is('login')) {
                return redirect('/'); //Redirect to the default page
            }
            // Token exists, proceed to the requested route
            return $next($request);
        } else {
            // No token found, redirect to login
            return Redirect::to('/login');
        }
    }
}
