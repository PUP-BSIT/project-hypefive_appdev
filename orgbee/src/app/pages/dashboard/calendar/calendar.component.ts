import { Component, OnInit } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import { EventService } from '../../../../service/event-service/event.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  viewDate: Date = new Date();
  events: CalendarEvent[] = [];
  isEventDetailsVisible: boolean = false;
  selectedEvents: CalendarEvent[] = [];
  selectedEvent: CalendarEvent | null = null;

  constructor(private eventService:EventService) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.eventService.getUpcomingEvents().subscribe((events: any) => {
      this.events = events.map((event: any) => ({
        start: new Date(event.date),
        title: event.event_name,
        time: event.time,
      }));
    });
  }

  formatTime(timeString: string): string {
    const [hours, minutes] = timeString.split(':');
    let hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12; 
    const formattedTime = `${hour}:${minutes} ${ampm}`;
    return formattedTime;
  }

  setViewDate(monthOffset: number) {
    const currentMonth = this.viewDate.getMonth();
    const currentYear = this.viewDate.getFullYear();
    const newMonth = currentMonth + monthOffset;

    this.viewDate = new Date(currentYear, newMonth, 1);
  }

  get monthName(): string {
    return this.viewDate.toLocaleString('default', { month: 'long' });
  }

  handleDayClick(event: any): void {
    const clickedDay = event.day;
    const clickedDate: Date = new Date(clickedDay.date);
    const today: Date = new Date();
  
    today.setHours(0, 0, 0, 0);
    clickedDate.setHours(0, 0, 0, 0);
  
    const clickedEvents = this.events.filter(event =>
      event.start.getFullYear() === clickedDate.getFullYear() &&
      event.start.getMonth() === clickedDate.getMonth() &&
      event.start.getDate() === clickedDate.getDate()
    );
  
    this.selectedEvents = clickedEvents;
    this.isEventDetailsVisible = clickedEvents.length > 0;
  }
}

