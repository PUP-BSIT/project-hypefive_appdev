import { Component, OnInit } from '@angular/core';
import { Time } from '@angular/common';

import { DataService } from '../../../service/data.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { EMPTY, catchError, debounceTime, switchMap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

import { Response } from '../../app.component';
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
  searchArchive: FormGroup;
  currentSlide = 0;
  currentDate: Date = new Date();

  isSearchResult=false;
  retrievedEvent: Event[];
  response: Response;

  imgPath: string = 'http://127.0.0.1:8000/storage/images/event_poster/';
  constructor(
    private dataService: DataService,
    private fb:FormBuilder) {}

  ngOnInit(): void {
    this.searchArchive = this.fb.group({keyword:[''] });
    this.getYearlyEvents();
    this.getOldEvents() ;
    this.searchEvents();
  } 

  getCurrentMonthYear(): string {
    return this.currentDate.toLocaleString('en-US', { month: 'long' }) 
      + ' ' + this.currentDate.getFullYear();
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

  searchClick(retrievedEvent:Event) {
    this.isSearchResult=true;
    this.showEventModal = true;
    this.selectedEvent.push(retrievedEvent);
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

  searchEvents(){
    this.searchArchive.get('keyword')!.valueChanges.pipe(
      switchMap((keyword)=>{
        console.log(keyword);
        return this.dataService.searchArchive(keyword).pipe(
          debounceTime(2000),
          catchError((error: HttpErrorResponse)=>{
            console.log(error);
            return EMPTY;
        }))
      }))
      .subscribe((value:Event[] | Response)=>{
        if (Array.isArray(value)){
          this.retrievedEvent=value;
          this.response = null;
        } else{
          this.retrievedEvent=[];
          this.response = value;
        }
      });
  }

  seeResults(){
    this.isSearchResult=true;
  }

  exitSearch(){
    this.retrievedEvent = [];
    this.isSearchResult = false;
  }
  
}
