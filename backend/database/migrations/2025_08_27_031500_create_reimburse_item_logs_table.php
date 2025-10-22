<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reimburse_item_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('reimburse_item_id')->constrained('reimburse_items')->onDelete('cascade');
            $table->foreignId('reimburse_request_id')->constrained('reimburse_requests')->onDelete('cascade');
            $table->foreignId('acted_by')->nullable()->constrained('users')->onDelete('set null');
            $table->string('action'); // e.g. approved_item, rejected_item, paid_item
            $table->text('remarks')->nullable();
            $table->timestamps(); // created_at tells when the action happened
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reimburse_item_logs');
    }
};
