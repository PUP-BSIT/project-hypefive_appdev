<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class IconSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('icons')-> insert([
            ['icon_location'=>'../../../assets/icons/1.png'],
            ['icon_location'=>'../../../assets/icons/2.png'],
            ['icon_location'=>'../../../assets/icons/3.png'],
            ['icon_location'=>'../../../assets/icons/4.png'],
            ['icon_location'=>'../../../assets/icons/5.png'],
            ['icon_location'=>'../../../assets/icons/6.png'],
            ['icon_location'=>'../../../assets/icons/7.png'],
            ['icon_location'=>'../../../assets/icons/8.png'],
            ['icon_location'=>'../../../assets/icons/9.png'],
            ['icon_location'=>'../../../assets/icons/10.png'],
        ]);
    }
}
