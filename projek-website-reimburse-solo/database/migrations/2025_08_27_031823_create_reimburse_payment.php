<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reimburse_payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('reimburse_item_id')->constrained('reimburse_items')->onDelete('cascade');
            $table->decimal('amount', 15, 2);
            $table->enum('payment_method', ['cash', 'transfer', 'e-wallet']);
            $table->string('transaction_ref')->nullable();
            $table->foreignId('paid_by')->constrained('users');
            $table->timestamp('paid_at')->useCurrent();
            $table->timestamps();
        });
        
    }

    public function down(): void
    {
        Schema::dropIfExists('reimburse_payment');
    }
};
