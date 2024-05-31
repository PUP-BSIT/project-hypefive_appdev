<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AccountStatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('account_statuses')-> insert([
            ['status'=>'pending'],
            ['status'=>'accepted'],
            ['status'=>'declined']
        ]);
    }
}
