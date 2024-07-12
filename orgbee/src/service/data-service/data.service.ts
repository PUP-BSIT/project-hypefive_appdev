import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable()

export class DataService {
  
  constructor(private http:HttpClient) { }

  registerEvent(data) {
    return this.http.post(environment.apiUrl +'/registerEvent/', data);
  }

  checkRegistration(data){
    return this.http.post(environment.apiUrl +'/checkRegistration/', data);
  }

  unregisterEvent(data){
    return this.http.post(environment.apiUrl +'/unregisterEvent/', data);
  }

  reRegisterEvent(data){
    return this.http.post(environment.apiUrl +'/reRegisterEvent/', data);
  }

  getTotalMembers(){
    return this.http.get(environment.apiUrl +'/getTotalMembers/');
  }

  getTotalUpcomingEvents(){
    return this.http.get(environment.apiUrl +'/getTotalUpcomingEvents/');
  }

  getTotalPendingPosts(){
    return this.http.get(environment.apiUrl +'/getTotalPendingPosts/');
  }

  getFiveEvents() {
    return this.http.get(environment.apiUrl +'/getFiveEvents/');
  }
}
