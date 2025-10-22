<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

use function Laravel\Prompts\error;

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

    public function changePassword(Request $request)
    {
        try {
            $validated = $request->validate([
                'old_password' => 'required',
                'new_password' => 'required|string|min:8|max:20|confirmed',
            ]);

            $user = $request->user();

            if (!Hash::check($validated['old_password'], $user->password)) {
                return response()->json([
                    'message' => 'Password lama salah',
                ], 400);
            }

            $user->update([
                'password' => Hash::make($validated['new_password']),
            ]);

            return response()->json([
                'message' => 'Password berhasil diubah',
            ], 200);
        }
        catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validasi gagal',
                'errors' => $e->errors(),
            ], 422);
        }
        catch (\Exception $e) {
            return response()->json([
                'message' => 'Terjadi kesalahan pada server',
                'errors' => $e->getMessage(),
            ], 500);
        }
    }
}
