<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reimburse_items', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('request_id');
            $table->unsignedBigInteger('category_id');
            $table->date('expense_date');
            $table->string('description');
            $table->bigInteger('amount'); 
            $table->string('currency')->default('IDR');
            $table->enum('payment_method', ['cash', 'transfer', 'e-wallet']);
            $table->string('location')->nullable();
            $table->string('invoice_number')->unique();
            $table->string('receipt_path')->nullable();
            $table->enum('status', ['draft', 'pending', 'approved', 'rejected', 'canceled'])->default('pending');
            $table->enum('finance_status', ['pending', 'approved_finance', 'paid'])->default('pending');
            $table->timestamps();

            $table->foreign('request_id')->references('id')->on('reimburse_requests')->onDelete('cascade');
            $table->foreign('category_id')->references('id')->on('categories')->onDelete('cascade');
        });

    }

    public function down(): void
    {
        Schema::dropIfExists('reimburse_items');
    }
};
