import { Component, OnInit } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import { formatDate } from '@angular/common';
import { CalendarDateFormatter, DateFormatterParams } from 'angular-calendar';
import { DataService } from '../../../../service/data.service'; // Adjust the path as necessary

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

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.dataService.getUpcomingEvents().subscribe((events: any) => {
      this.events = events.map((event: any) => ({
        start: new Date(event.date),
        title: event.event_name,
        time: event.time,
      }));
    });
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
    const clickedEvents = this.events.filter(event =>
      event.start.getFullYear() === clickedDate.getFullYear() &&
      event.start.getMonth() === clickedDate.getMonth() &&
      event.start.getDate() === clickedDate.getDate()
    );

    this.selectedEvents = clickedEvents;
    this.isEventDetailsVisible = true;
  }
}

export class CustomDateFormatter extends CalendarDateFormatter {
  public monthViewColumnHeader({ date, locale }: DateFormatterParams): string {
    return formatDate(date, 'EEE', locale); // use short week days
  }
}
