<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class AdminAuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (!$token = auth('api')->attempt($credentials)) {
            return response()->json(['error' => 'Email atau password salah'], 401);
        };

        $user = auth('api')->user();

        if ($user->role != 'super_admin') {
            return response()->json([
                'message' => 'Access denied'
            ], 403);
        };

        return response()->json([
            'access_token' => $token,
            'token_type'   => 'bearer',
            'expires_in'   => config('jwt.ttl') * 60,
            'user'         => auth('api')->user()
        ]);
    }

    public function me()
    {
        return response()->json(auth('api')->user());
    }

    public function logout()
    {
        auth('api')->logout();
        return response()->json(['message' => 'Logout berhasil']);
    }

    public function tampil()
    {
        $users = User::with('department')
                    ->select('id', 'name', 'email', 'role', 'department_id', 'created_at', 'updated_at')
                    ->get();

        return response()->json($users);
    }

}
