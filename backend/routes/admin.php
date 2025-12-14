<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminAuthController;


Route::post('/admin/login', [AdminAuthController::class, 'login']);

Route::prefix('admin')->middleware(['auth:web_admin', 'role:super_admin'])->group(function () {
   Route::post('/logout', [AdminAuthController::class, 'logout']);
});