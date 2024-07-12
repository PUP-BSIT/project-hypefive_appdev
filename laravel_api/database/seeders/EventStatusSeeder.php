<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EventStatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('event_status')-> insert([
            ['status_name'=>'draft'],
            ['status_name'=>'posted'],
            ['status_name'=>'deleted']
        ]);
    }
}
