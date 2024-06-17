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
  selectedEvent: Event[] = [];
  oldEvents: Event[] = [];
  
  currentSlide = 0;
  currentDate: Date = new Date();

  constructor(private dataService: DataService) {}


  ngOnInit(): void {
    this.getYearlyEvents();
    this.getOldEvents() ;
  } 

  getCurrentMonthYear(): string {
    return this.currentDate.toLocaleString('en-US', { month: 'long' }) + ' ' + this.currentDate.getFullYear();
  }

  getYearlyEvents() {
    this.dataService.getYearlyEvents().subscribe((yearlyEvents: Event[])=>{
      this.events = yearlyEvents;
    });
  }

  getOldEvents() {
    this.dataService.getOldEvents().subscribe((oldEvents: Event[])=>{
      this.oldEvents = oldEvents;
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
