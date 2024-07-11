import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable()

export class DataService {
  
  constructor(private http:HttpClient) { }

  registerUser(data) {
    return this.http.post(environment.apiUrl +'/register/', data);
  }

  searchEmail(data) {
    return this.http.get(environment.apiUrl +
      `/signup/search_email?search_email=${data}`);
  }

  searchStudentNum(data) {
    return this.http.get(environment.apiUrl +
      `/signup/search_student_num?search_student_num=${data}`);
  }

  login(data) {
    return this.http.post(environment.apiUrl +'/login/', data);
  }

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
