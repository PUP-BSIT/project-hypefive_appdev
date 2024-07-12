<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class StatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('status')-> insert([
            ['status_name'=>'pending'],
            ['status_name'=>'accepted'],
            ['status_name'=>'declined']
        ]);
    }
}
