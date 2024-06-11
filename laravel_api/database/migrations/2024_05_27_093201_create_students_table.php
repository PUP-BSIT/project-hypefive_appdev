<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void {
        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->string('first_name', 25);
            $table->string('last_name', 25);
            $table->string('student_number', 15)->unique();
            $table->date('birthday');
            $table->string('gender', 10);
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('role_id')->default(1);
            $table->unsignedBigInteger('icon_id');

            $table->foreign('user_id')->references('id')->on('users')
                ->onDelete('CASCADE')->onUpdate('CASCADE');

            $table->foreign('role_id')->references('id')->on('roles')
                ->onDelete('CASCADE')->onUpdate('CASCADE');

            $table->foreign('icon_id')->references('id')->on('icons')
                ->onDelete('CASCADE')->onUpdate('CASCADE');
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};
