<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('freedomwall', function (Blueprint $table) {
            $table->id();
            $table->string('subject', 30);
            $table->string('content', 500);
            //By default, the post is POSTED
            $table->boolean('is_posted')->default(true);
            //By default, the freedomwall is ACCESSIBLE
            $table->boolean('accessibility')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('freedomwall');
    }
};
