import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-data',
  templateUrl: './admin-data.component.html',
  styleUrl: './admin-data.component.css'
})
export class AdminDataComponent implements OnInit {
  currentDay: string;
  currentDate: number;
  today: Date;

  ngOnInit(): void {
    this.today = new Date();
    this.currentDay = this.today.toLocaleString('en-US', { weekday: 'long' });
    this.currentDate = this.today.getDate();
  }
}
