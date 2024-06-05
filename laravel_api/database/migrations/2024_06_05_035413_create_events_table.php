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
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->string('event_name', 50);
            $table->string('location', 50);
            $table->date('date');
            $table->time('time');
            //By default, all members are NOT REQUIRED
            $table->boolean('all_members_required')->default(false); 
            //By default, the event DOESN"T HAVE A FEE
            $table->boolean('has_reg_fee')->default(false); 
            $table->integer('registration_fee');
            $table->integer('max_attendees');
            $table->string('caption', 850);
            $table->string('poster_loc', 255);
            $table->unsignedBigInteger('event_status_id')->default(1);
            $table->unsignedBigInteger('event_state_id')->default(1);
            $table->timestamps();

            $table->foreign('event_status_id')->references('id')
                ->on('event_status')->onDelete('CASCADE')->onUpdate('CASCADE');
            $table->foreign('event_state_id')->references('id')
                ->on('event_state')->onDelete('CASCADE')->onUpdate('CASCADE');


            
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
