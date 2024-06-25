import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-today',
  templateUrl: './admin-today.component.html',
  styleUrl: './admin-today.component.css'
})
export class AdminTodayComponent {
  currentDay: string;
  currentDate: number;
  today: Date;

  ngOnInit(): void {
    this.today = new Date();
    this.currentDay = this.today.toLocaleString('en-US', { weekday: 'long' });
    this.currentDate = this.today.getDate();
  }
}
