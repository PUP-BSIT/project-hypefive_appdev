import { Component, OnInit } from '@angular/core';
import { Time } from '@angular/common';

import { DataService } from '../../../service/data.service';

interface Event {
  id: number;
  event_name: string; 
  location: string; 
  date: Date; 
  time: Time; 
  all_members_required: number; 
  has_reg_fee: number;  
  registration_fee?: number; 
  max_attendees: number; 
  caption?: string;
  poster_loc?: string; 
  event_status_id: number;
  event_state_id: number;
}

@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.css']
})

export class ArchiveComponent implements OnInit  {
  showEventModal= false;
  events: Event[] = [];
  selectedEvent: Event[];

  constructor(private dataService: DataService) {}

  eventLists = [
    { eventTitle: "Knights of Honor", eventDate: "03/10/2020"},
    { eventTitle: "Knights of Honor", eventDate: "03/10/2020"},
    { eventTitle: "Knights of Honor", eventDate: "03/10/2020"},
    { eventTitle: "Knights of Honor", eventDate: "03/10/2020"},
  ];

  details = [
    { icon: '../../../assets/icon.jpg', 
      eventTitle: "Knights of Honor",
      eventLocation: "Gym",
      eventDate: "March 10, 2020",
      eventCaption: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed fringilla, nisi sit.'
    }
  ];
  currentSlide = 0;

  currentDate: Date = new Date();

  ngOnInit(): void {
    this.getYearlyEvents();
    this.selectedEvent = [];
  } 

  getCurrentMonthYear(): string {
    return this.currentDate.toLocaleString('en-US', { month: 'long' }) + ' ' + this.currentDate.getFullYear();
  }

  getYearlyEvents() {
    this.dataService.getYearlyEvents().subscribe((yearlyEvents: Event[])=>{
      this.events = yearlyEvents;
    });
  }

  eventClick (event: Event) {
    this.showEventModal = true;

    this.selectedEvent.push(event);
  }
  
  closeModal() {
    this.showEventModal = false;
    this.selectedEvent = [];
  }

  moveLeft() {
    if (this.currentSlide > 0) {
      this.currentSlide -= 3;
    }
  }

  moveRight() {
    const maxSlides = Math.ceil(this.events.length / 3) - 1;
    if (this.currentSlide < maxSlides * 3) {
      this.currentSlide += 3;
    }
  }
}
