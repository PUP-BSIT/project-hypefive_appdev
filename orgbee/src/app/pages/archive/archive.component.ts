import { Component, OnInit } from '@angular/core';
import { Time } from '@angular/common';

import { ArchiveService } from '../../../service/archive-service/archive.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { EMPTY, catchError, debounceTime, switchMap } from 'rxjs';
import { of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

import { Response } from '../../../service/response-service/response.service';
import { ResponseService } 
  from '../../../service/response-service/response.service';
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

  constructor(
    private archiveService: ArchiveService,
    private fb:FormBuilder, 
    private responseService: ResponseService) {}

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
    this.archiveService.getYearlyEvents().pipe(
      catchError((error) => {
        if (!navigator.onLine) {
          this.responseService.handleError
            ('You are offline. Please check your internet connection.');
        } else {
          this.responseService.handleError
            (`An error occurred while approving the post. 
              Please try again.`);
        }

        // Return an empty observable to complete the pipe
        return of(null);
      })
    ).subscribe((yearlyEvents: Event[])=>{
      this.events = yearlyEvents;
    });
  }

  getOldEvents() {
    this.archiveService.getOldEvents().pipe(
      catchError((error) => {
        if (!navigator.onLine) {
          this.responseService.handleError
            ('You are offline. Please check your internet connection.');
        } else {
          this.responseService.handleError
            (`An error occurred while approving the post. 
              Please try again.`);
        }

        // Return an empty observable to complete the pipe
        return of(null);
      })
    ).subscribe((oldEvents: Event[])=>{
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

  truncateText(text: string, limit: number): string {
    return text.length > limit ? text.substring(0, limit) + '...' : text;
  }

  searchEvents(){
    this.searchArchive.get('keyword')!.valueChanges.pipe(
      switchMap((keyword)=>{
        return this.archiveService.searchArchive(keyword).pipe(
          debounceTime(2000),
          catchError((error: HttpErrorResponse)=>{
            if (!navigator.onLine) {
              this.responseService.handleError
                ('You are offline. Please check your internet connection.');
            } else {
              this.responseService.handleError
                (`An error occurred while approving the post. 
                  Please try again.`);
            }
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
