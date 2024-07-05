import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface Event {
  id: number;
  event_name: string; 
  location: string; 
  date: Date; 
  time: string; 
  all_members_required: number; 
  has_reg_fee: number;  
  registration_fee?: number; 
  max_attendees: number; 
  caption?: string;
  poster_loc: string; 
  event_status_id: number;
  event_state_id: number;
  reg_count:number;
}

export interface ModalButton {
  upcomingModalButton: boolean;
  draftModalButton: boolean;
  occuringModalButton: boolean;
}

@Injectable()
export class EventService {

  constructor(private http:HttpClient) { }
  createEvent(data) {
    return this.http.post(environment.apiUrl +'/createEvent/', data);
  }

  getUpcomingEvents() {
    return this.http.get(environment.apiUrl +'/getUpcomingEvents/');
  }

  getDraftEvents() {
    return this.http.get(environment.apiUrl +'/getDraftEvents/');
  }

  getOccuringEvents() {
    return this.http.get(environment.apiUrl +'/getOccuringEvents/');
  }

  markAsOccuring(data) {
    return this.http.post(environment.apiUrl +'/markAsOccuring/', data);
  }

  markAsComplete(data) {
    return this.http.post(environment.apiUrl +'/markAsComplete/', data);
  }

  publishDraft(data) {
    return this.http.post(environment.apiUrl +'/publishDraft/', data);
  }

  cancelEvent(data) {
    return this.http.post(environment.apiUrl +'/cancelEvent/', data);
  }

  updateEvent(data) {
    return this.http.post(environment.apiUrl +'/updateEvent/', data);
  }
  
  getRegisteredMembers(event_id: number){
    return this.http.get(environment.apiUrl +`/getRegisteredMembers/${event_id}`);
  }

}
