import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../../service/data-service/data.service';
import { Event } from '../../../../service/event-service/event.service';

@Component({
  selector: 'app-admin-today',
  templateUrl: './admin-today.component.html',
  styleUrls: ['./admin-today.component.css']
})
export class AdminTodayComponent implements OnInit {
  currentDay: string;
  currentDate: number;
  today: Date;
  todayDateString: string;

  upcomingEvents: Event[] = [];

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.today = new Date();
    this.currentDay = this.today.toLocaleString('en-US', { weekday: 'long' });
    this.currentDate = this.today.getDate();
    this.todayDateString = this.formatDateToYYYYMMDD(this.today); 

    this.getTodayEvents();
  }

  getTodayEvents() {
    this.dataService.getFiveEvents().subscribe((res: Event[]) => {
      this.upcomingEvents = res
        .filter(event => this.formatDateToYYYYMMDD(new Date(event.date)) === this.todayDateString) 
        .map(event => {
          // Format 'time' to 12-hour format
          const formattedTime = this.formatTimeTo12Hour(event.time);
          return { ...event, formattedTime }; 
        });
    });
  }

  private formatDateToYYYYMMDD(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private formatTimeTo12Hour(time24: string): string {
    const [hour, minute] = time24.split(':').slice(0, 2);
    const period = +hour >= 12 ? 'PM' : 'AM';
    const hour12 = +hour % 12 || 12; 

    return `${hour12}:${minute} ${period}`;
  }
}
