<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();

            $table->string('staff_id')->unique()->required();
            $table->string('full_name')->required();
            $table->string('email')->unique()->required();
            $table->string('password')->required();

            $table->foreignId('department_id')->constrained('departments')->onDelete('cascade');
            $table->string('position')->nullable();
            $table->string('phone_number')->nullable();
            $table->text('address')->nullable();
            $table->text('profile_picture')->nullable();

            $table->string('bank_name')->nullable();
            $table->string('account_number')->nullable();

            $table->string('theme_preference', 20)->default('light');
            $table->string('languange', 10)->default('id');

            $table->enum('role', ['admin', 'employee', 'manager', 'finance']);
            $table->boolean('is_active')->default(true);

            $table->timestamps();

        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
