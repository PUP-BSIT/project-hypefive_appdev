import { Component } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import { formatDate } from '@angular/common';
import { CalendarDateFormatter, DateFormatterParams } from 'angular-calendar';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent {
  viewDate: Date = new Date();
  events: CalendarEvent[] = [
    {
      start: new Date(2024, 5, 14), // June 14
      title: 'Event on June 14',
    },
    {
      start: new Date(2024, 5, 15), // June 15
      title: 'Party',
    },
    {
      start: new Date(2024, 5, 15), // June 15
      title: 'Dance',
    },
    {
      start: new Date(2024, 5, 15), // June 15
      title: 'Sing',
    },
    {
      start: new Date(2024, 5, 16), // June 16
      title: 'Event on June 16',
    },
    // Add more events as needed
  ];

  isEventDetailsVisible: boolean = false;
  selectedEvents: CalendarEvent[] = [];
  selectedEvent: CalendarEvent | null = null;

  // Method to handle view change, such as navigating months
  setViewDate(monthOffset: number) {
    const currentMonth = this.viewDate.getMonth();
    const currentYear = this.viewDate.getFullYear();
    const newMonth = currentMonth + monthOffset;

    this.viewDate = new Date(currentYear, newMonth, 1);
  }

  // Get the month name
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
