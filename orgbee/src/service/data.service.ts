import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()

export class DataService {
  apiUrl = 'http://127.0.0.1:8000/';
  // apiUrl = 'https://orgbee.online/';

  constructor(private http:HttpClient) { }

  registerUser(data) {
    return this.http.post(this.apiUrl +'api/register/', data);
  }

  searchEmail(data) {
    return this.http.get(this.apiUrl +
        `api/signup/search_email?search_email=${data}`);
  }

  searchStudentNum(data) {
    return this.http.get(this.apiUrl +
        `api/signup/search_student_num?search_student_num=${data}`);
  }

  login(data) {
    return this.http.post(this.apiUrl +'api/login/', data);
  }

  registerEvent(data) {
    return this.http.post(this.apiUrl +'api/registerEvent/', data);
  }

  checkRegistration(data){
    return this.http.post(this.apiUrl +'api/checkRegistration/', data);
  }

  unregisterEvent(data){
    return this.http.post(this.apiUrl +'api/unregisterEvent/', data);
  }

  reRegisterEvent(data){
    return this.http.post(this.apiUrl +'api/reRegisterEvent/', data);
  }

  getTotalMembers(){
    return this.http.get(this.apiUrl +'api/getTotalMembers/');
  }

  getTotalUpcomingEvents(){
    return this.http.get(this.apiUrl +'api/getTotalUpcomingEvents/');
  }

  getTotalPendingPosts(){
    return this.http.get(this.apiUrl +'api/getTotalPendingPosts/');
  }

  getFiveEvents() {
    return this.http.get(this.apiUrl +'api/getFiveEvents/');
  }
}
