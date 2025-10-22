<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  mixed ...$roles
     */
    public function handle(Request $request, Closure $next, ...$roles)
    {
        $user = auth('api')->user();

        // Kalau belum login
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        // Cek apakah role user ada di parameter middleware
        if (!in_array($user->role, $roles)) {
            return response()->json(['message' => 'Forbidden: akses tidak diizinkan'], 403);
        }

        return $next($request);
    }
}
