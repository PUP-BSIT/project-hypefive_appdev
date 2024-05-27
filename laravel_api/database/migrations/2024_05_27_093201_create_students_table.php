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
            $table->string('student_number', 15);
            $table->date('birthday');
            $table->string('gender', 10);
            $table->unsignedBigInteger('role_id')->default(1);
            $table->unsignedBigInteger('account_status_id')->default(1);

            $table->foreign('role_id')->references('id')->on('roles')
                ->onDelete('CASCADE')->onUpdate('CASCADE');
                
            $table->foreign('account_status_id')->references('id')
                ->on('account_status')->onDelete('CASCADE')
                ->onUpdate('CASCADE');
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
