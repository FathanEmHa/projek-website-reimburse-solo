<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ReimburseController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ApprovalController;
use App\Http\Controllers\MobileAuthController;

Route::post('/mobile/login', [MobileAuthController::class, 'login']);

Route::middleware('auth:api')->prefix('mobile')->group(function () {
    Route::get('/me', [MobileAuthController::class, 'me']);
    Route::post('/logout', [MobileAuthController::class, 'logout']);

    Route::middleware(['role:employee'])->group(function () {
        // lihat profile
        Route::put('/users/profile', [UserController::class, 'updateProfile']);
        Route::get('/users/profile', [UserController::class, 'showProfile']);
        Route::put('/users/change-password', [UserController::class, 'changePassword']);

        // mengajukan reimburse langsung (status submitted)
        Route::post('/reimburse', [ReimburseController::class, 'storeRequest']);

        // fitur draft reimburse
        Route::post('/reimburse/draft', [ReimburseController::class, 'saveDraft']);
        Route::get('/reimburse/drafts', [ReimburseController::class, 'myDrafts']);
        Route::get('/reimburse/draft/{id}', [ReimburseController::class, 'showDraft']);
        Route::put('/reimburse/draft/{id}', [ReimburseController::class, 'updateDraft']);
        Route::post('/reimburse/{id}/submit', [ReimburseController::class, 'submitDraft']);
        Route::delete('/reimburse/draft/{id}', [ReimburseController::class, 'deleteDraft']);

        // delete item dari draft atau request
        Route::delete('/reimburse/item/{id}', [ReimburseController::class, 'deleteItem']);

        // fitur crud request reimburse
        Route::get('/reimburse/request', [ReimburseController::class, 'myRequests']);
        Route::get('/reimburse/request/{id}', [ReimburseController::class, 'showRequest']);
        Route::put('/reimburse/request/{id}', [ReimburseController::class, 'updateRequest']);
        Route::put('/reimburse/request/{id}/cancel', [ReimburseController::class, 'canceledRequest']);
        Route::delete('/reimburse/request/{id}', [ReimburseController::class, 'deleteRequest']);
    });

    Route::middleware(['role:manager'])->group(function () {
        Route::get('/manager/reimburse/requests', [ApprovalController::class, 'submittedRequests']);  // Menggunakan metode query parameter
        Route::get('/manager/reimburse/requests/{id}', [ApprovalController::class, 'showRequest']);
        Route::post('/manager/reimburse/items/{id}/approve', [ApprovalController::class, 'approveItem']);
        Route::post('/manager/reimburse/requests/{id}/approve-all', [ApprovalController::class, 'approveAllItems']);
        Route::get('/manager/reimburse/request/{id}/logs', [ApprovalController::class, 'requestLogs']);  // Menggunakan metode query parameter
    });

    Route::middleware(['role:finance'])->group(function () {
        Route::get('/finance/reimburse/pendingRequests', [PaymentController::class, 'pendingRequests']);
        Route::get('/finance/reimburse/showRequest/{id}', [PaymentController::class, 'showRequest']);
        Route::post('/finance/reimburse/item/{id}/pay', [PaymentController::class, 'payItem']);
        Route::post('/finance/reimburse/{id}/payall', [PaymentController::class, 'payAll']);
    });
});