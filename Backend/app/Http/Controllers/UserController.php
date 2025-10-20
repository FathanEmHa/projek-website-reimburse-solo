<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class UserController extends Controller
{
    public function showProfile(Request $request)
    {
        // Menggunakan auth untuk mendapatkan user yang sedang login
        $user = $request->user()->load('department');

        return response()->json([
            'message' => 'User profile retrieved successfully',
            'data' => $user
        ]);
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user();
        
        // validasi input
        $validatedData = $request->validate([
            'phone_number' => 'sometimes|string|max:20',
            'address' => 'sometimes|string|max:225',
            'bank_name' => 'sometimes|string|max:20',
            'account_number' => 'sometimes|string|max:30',
            'profile_picture' => 'sometimes|image|mimes:jpg,jpeg,png|max:2048',
            'theme_preference' => 'sometimes|in:light,dark',
            'languange' => 'sometimes|in:id,en',
        ]);

        if ($request->hasFile('profile_picture')) {
            $path = $request->file('profile_picture')->store('profile_pictures', 'public');
            $validatedData['profile_picture'] = $path;
        }

        $user->update($validatedData);

        $user->refresh()->load('department');

        return response()->json([
            'data' => $user
        ]);
    }
}
