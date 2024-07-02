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

  createEvent(data) {
    return this.http.post(this.apiUrl +'api/createEvent/', data);
  }

  getUpcomingEvents() {
    return this.http.get(this.apiUrl +'api/getUpcomingEvents/');
  }

  getDraftEvents() {
    return this.http.get(this.apiUrl +'api/getDraftEvents/');
  }

  getOccuringEvents() {
    return this.http.get(this.apiUrl +'api/getOccuringEvents/');
  }

  markAsOccuring(data) {
    return this.http.post(this.apiUrl +'api/markAsOccuring/', data);
  }

  markAsComplete(data) {
    return this.http.post(this.apiUrl +'api/markAsComplete/', data);
  }

  publishDraft(data) {
    return this.http.post(this.apiUrl +'api/publishDraft/', data);
  }

  cancelEvent(data) {
    return this.http.post(this.apiUrl +'api/cancelEvent/', data);
  }

  updateEvent(data) {
    return this.http.post(this.apiUrl +'api/updateEvent/', data);
  }

  getYearlyEvents() {
    return this.http.get(this.apiUrl +'api/getYearlyEvents/');
  }

  getOldEvents() {
    return this.http.get(this.apiUrl +'api/getOldEvents/');
  }

  searchArchive(data) {
    return this.http.get(this.apiUrl +
        `api/archive/search_archive?search_archive=${data}`);
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

  getRegisteredMembers(event_id: number){
    return this.http.get(this.apiUrl + `api/getRegisteredMembers/${event_id}`);
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
