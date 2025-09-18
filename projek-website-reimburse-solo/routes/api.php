<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ReimburseController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ApprovalController;

Route::post('/login', [AuthController::class, 'login']);

// Route dengan proteksi JWT
Route::middleware('auth:api')->group(function () {
    Route::get('/dashboard', function () {
        return response()->json(['message' => 'Welcome to dashboard']);
    });
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
});

Route::middleware(['auth:api', 'role:manager'])->group(function () {
    Route::get('/manager/reimburse/requests', [ApprovalController::class, 'submittedRequests']);  // Menggunakan metode query parameter
    Route::get('/manager/reimburse/requests/{id}', [ApprovalController::class, 'showRequest']);
    Route::post('/manager/reimburse/items/{id}/approve', [ApprovalController::class, 'approveItem']);
    Route::post('/manager/reimburse/items/{id}/reject', [ApprovalController::class, 'rejectItem']);
    Route::post('/manager/reimburse/requests/{id}/approve-all', [ApprovalController::class, 'approveAllItems']);
    Route::post('/manager/reimburse/requests/{id}/reject-all', [ApprovalController::class, 'rejectAllItems']);
    Route::get('/manager/reimburse/request/{id}/logs', [ApprovalController::class, 'requestLogs']);  // Menggunakan metode query parameter
});

Route::middleware(['auth:api', 'role:finance'])->group(function () {
    Route::get('/finance/reimburse/pending', [PaymentController::class, 'pending']);
    Route::post('/finance/reimburse/item/{id}/pay', [PaymentController::class, 'payItem']);
    Route::post('/finance/reimburse/payall', [PaymentController::class, 'payAll']);
});     

Route::middleware(['auth:api', 'role:admin'])->group(function () {
    Route::get('/admin/users', [UserController::class, 'index']);
});

Route::middleware(['auth:api', 'role:employee'])->group(function () {
    // mengajukan reimburse langsung (status submitted)
    Route::post('/reimburse', [ReimburseController::class, 'storeRequest']);

    // fitur draft reimburse
    Route::post('/reimburse/draft', [ReimburseController::class, 'saveDraft']);
    Route::get('/reimburse/drafts', [ReimburseController::class, 'myDrafts']);
    Route::get('/reimburse/draft/{id}', [ReimburseController::class, 'showDraft']);
    Route::put('/reimburse/draft/{id}', [ReimburseController::class, 'updateDraft']);
    Route::post('/reimburse/{id}/submit', [ReimburseController::class, 'submitDraft']);
    Route::delete('/reimburse/draft/{id}', [ReimburseController::class, 'deleteDraft']);

    // fitur crud request reimburse
    Route::get('/reimburse/request', [ReimburseController::class, 'myRequests']);
    Route::get('/reimburse/request/{id}', [ReimburseController::class, 'showRequest']);
    Route::put('/reimburse/request/{id}', [ReimburseController::class, 'updateRequest']);
    Route::put('/reimburse/request/{id}/cancel', [ReimburseController::class, 'canceledRequest']);
    Route::delete('/reimburse/request/{id}', [ReimburseController::class, 'deleteRequest']);
});