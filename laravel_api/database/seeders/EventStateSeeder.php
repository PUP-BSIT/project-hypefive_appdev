<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EventStateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('event_state')-> insert([
            ['state_name'=>'upcoming'],
            ['state_name'=>'ongoing'],
            ['state_name'=>'completed'], 
            ['state_name'=>'canceled'],
            ['state_name'=>'recurring']//remove this
        ]);
    }
}
