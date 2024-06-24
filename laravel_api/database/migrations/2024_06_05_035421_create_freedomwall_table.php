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
            $table->unsignedBigInteger('post_status_id')->default(1);
            $table->string('background_color', 8);
            $table->string('student_id', 255);
            $table->boolean('is_deletion_requested')->default(false);
            $table->integer('deletion_req_count')->default(0);
            $table->timestamps();

            $table->foreign('post_status_id')->references('id')
                ->on('status')->onDelete('CASCADE')
                ->onUpdate('CASCADE');
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
