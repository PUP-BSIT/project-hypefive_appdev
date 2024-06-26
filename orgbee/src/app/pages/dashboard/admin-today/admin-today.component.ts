import { Component } from '@angular/core';

import { DataService } from '../../../../service/data.service';
import { Event } from '../../events/events.component';

@Component({
  selector: 'app-admin-today',
  templateUrl: './admin-today.component.html',
  styleUrl: './admin-today.component.css'
})
export class AdminTodayComponent {
  currentDay: string;
  currentDate: number;
  today: Date;

  upcomingEvents: Event[];
  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.today = new Date();
    this.currentDay = this.today.toLocaleString('en-US', { weekday: 'long' });
    this.currentDate = this.today.getDate();

    this.getFiveEvents();
  }

  getFiveEvents() {
    this.dataService.getFiveEvents().subscribe((res: Event[]) => {
      this.upcomingEvents = res.map(event => {
        // Format 'time' to 12-hour format
        const formattedTime = this.formatTimeTo12Hour(event.time);
        return { ...event, formattedTime }; // Include formattedTime in the event object
      });
      console.log(this.upcomingEvents);
    });
  }

  private formatTimeTo12Hour(time24: string): string {
    const [hour, minute] = time24.split(':').slice(0, 2);
    const period = +hour >= 12 ? 'PM' : 'AM';
    const hour12 = +hour % 12 || 12; // Convert hour to 12-hour format

    return `${hour12}:${minute} ${period}`;
  }
}
