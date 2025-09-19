<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reimburse_requests', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->string('request_code')->unique();
            $table->date('date_submitted')->nullable();
            $table->enum('status', [
                'draft',
                'submitted',
                'approved_manager',
                'partially_approved',
                'rejected_manager',
                'approved_finance',
                'rejected_finance',
                'canceled',
            ])->default('draft');
            $table->bigInteger('total_amount');
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reimburse_requests');
    }
};
