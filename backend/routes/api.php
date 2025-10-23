<?php

use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    require __DIR__.'/admin.php';
    require __DIR__.'/mobile.php';
});