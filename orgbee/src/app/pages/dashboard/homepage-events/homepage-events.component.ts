import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';

import { DataService } from '../../../../service/data.service';
import { Time } from '@angular/common';
import { LoginService, UserInfo } from '../../../../service/login.service';

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
  poster_loc: any; 
  event_status_id: number;
  event_state_id: number;
}
@Component({
  selector: 'app-homepage-events',
  templateUrl: './homepage-events.component.html',
  styleUrls: ['./homepage-events.component.css'],
  animations: [
    trigger('modalAnimation', [
      state('open', style({
        opacity: 1,
        transform: 'scale(1)'
      })),
      state('closed', style({
        opacity: 0,
        transform: 'scale(0.8)'
      })),
      transition('open <=> closed', animate('200ms ease-in-out'))
    ])
  ]
})
export class HomepageEventsComponent implements OnInit {
  isEventModalVisible = false;

  filteredEvents:Event[]=[];
  selectedEvent: Event  | null = null;
  imgPath: string = 'http://127.0.0.1:8000/storage/images/event_poster/';
  userInfo: UserInfo;
  isRegistered = false;
  constructor(private dataService: DataService, private loginService: LoginService) {}

  ngOnInit():void{
    this.showUpcomingEvents();
    this.loginService.onDataRetrieved((data: UserInfo) => {
      this.userInfo = data;
      console.log("events");
      console.log(this.userInfo);
    });
    
  }
  openEventModal(events: Event) {
    this.selectedEvent = events;
    this.isEventModalVisible = true;
    console.log(events);
  }

  closeEventModal() {
    this.isEventModalVisible = false;
  }

  showUpcomingEvents() {
    //Get events with event_state = 1 with status of 2
    this.dataService.getUpcomingEvents().subscribe((upcoming: Event[])=>{
      this.filteredEvents = upcoming;
    })
  }
register:any;
response:any;
  registerEvent(){
    this.register = {
      'event_id': this.selectedEvent.id,
      'student_id': this.userInfo.id
    };
    this.checkRegistration();
    this.dataService.registerEvent(this.register).subscribe((res)=>{
      this.response = res;
      console.log(this.response);
    });
  }

  checkRegistration(){
    this.register = {
      'event_id': this.selectedEvent.id,
      'student_id': this.userInfo.id
    };
    this.dataService.checkRegistration(this.register).subscribe((res)=>{
      this.response = res;
      if(this.response === 0){
        this.isRegistered = true;
      }
      
    });
  }
}
