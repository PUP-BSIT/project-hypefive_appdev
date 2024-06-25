import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';

import { DataService } from '../../../../service/data.service';
import { Time } from '@angular/common';
import { LoginService, UserInfo } from '../../../../service/login.service';

import { Event } from '../../events/events.component';
import { ToastrService } from 'ngx-toastr';
import { Response } from '../../../app.component';

interface Register {
  event_id: any;
  student_id: number;
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
  isRegistered = 0;

  register: Register;
  checkResponse: number;
  response:Response;
  regButton = false;
  message: string;
  constructor(
    private dataService: DataService, 
    private loginService: LoginService,  
    private toastr: ToastrService,) {}

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
    this.checkRegistration();
  }

  closeEventModal() {
    this.isEventModalVisible = false;
    this.message= '';
  }

  showUpcomingEvents() {
    //Get events with event_state = 1 with status of 2
    this.dataService.getUpcomingEvents().subscribe((upcoming: Event[])=>{
      this.filteredEvents = upcoming;
    })
  }

  registerEvent(){
    this.register = {
      'event_id': Number(this.selectedEvent.id),
      'student_id': Number(this.userInfo.id)
    };
    if(this.selectedEvent.max_attendees === this.selectedEvent.reg_count){
      this.message = "Maximum attendees reached";
    } else {
      this.dataService.registerEvent(this.register).subscribe((res: Response)=>{
        this.response = res;
        if (this.response.code === 200) {
          this.toastr.success(JSON.stringify(this.response.message), '', {
            timeOut: 2000,
            progressBar: true,
            toastClass: 'custom-toast success'
          });
        } else {
          this.toastr.error(JSON.stringify(this.response.message), '', {
            timeOut: 2000,
            progressBar: true,
            toastClass: 'custom-toast error'
          });
        }
      });
      this.message = '';
    }
    this.checkRegistration();
  }

  checkRegistration(){
    this.register = {
      'event_id':  Number(this.selectedEvent.id),
      'student_id': Number(this.userInfo.id)
    };
    this.dataService.checkRegistration(this.register).subscribe((res)=>{
      this.checkResponse = Number(JSON.stringify(res));
      if(this.checkResponse === 0){
        this.isRegistered = 0;
      } else if (this.checkResponse === 1) {
        this.isRegistered = 1;
      } else if (this.checkResponse === 2) {
        this.isRegistered = 2;
      }
    });
  }

  unregisterEvent(){
    this.register = {
      'event_id': Number(this.selectedEvent.id),
      'student_id': Number(this.userInfo.id)
    };
    this.dataService.unregisterEvent(this.register).subscribe((res: Response)=>{
      this.response = res;
      if (this.response.code === 200) {
        this.toastr.success(JSON.stringify(this.response.message), '', {
          timeOut: 2000,
          progressBar: true,
          toastClass: 'custom-toast success'
        });
      } else {
        this.toastr.error(JSON.stringify(this.response.message), '', {
          timeOut: 2000,
          progressBar: true,
          toastClass: 'custom-toast error'
        });
      }
      this.checkRegistration();
      this.message = '';
    });
  }

  reRegisterEvent(){
    this.register = {
      'event_id': Number(this.selectedEvent.id),
      'student_id': Number(this.userInfo.id)
    };
    if(this.selectedEvent.max_attendees === this.selectedEvent.reg_count){
      this.message = "Maximum attendees reached";
    } else {
      this.dataService.reRegisterEvent(this.register).subscribe((res: Response)=>{
        this.response = res;
        if (this.response.code === 200) {
          this.toastr.success(JSON.stringify(this.response.message), '', {
            timeOut: 2000,
            progressBar: true,
            toastClass: 'custom-toast success'
          });
        } else {
          this.toastr.error(JSON.stringify(this.response.message), '', {
            timeOut: 2000,
            progressBar: true,
            toastClass: 'custom-toast error'
          });
        }
        this.checkRegistration();
        this.message = '';
      });
    }
  }
}
