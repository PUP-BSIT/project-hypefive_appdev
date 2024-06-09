<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('users')-> insert([
            ['id'=>'1', 
             'email'=>'admin@gmail.com', 
             'password'=>Hash::make('password'), 
             'account_status_id'=>'2']
        ]);
        DB::table('students')-> insert([
            ['id'=>'1',
             'first_name'=>'super',
             'last_name'=>'admin',
             'student_number'=>'0000-00000-TG-0',
             'birthday'=>'1992-09-09', 
             'gender'=>'Other',
             'user_id'=>'1',
             'role_id'=>'3',
             'icon_id'=>'10']
        ]);
    }
}
