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

  login(data) {
    return this.http.post(this.apiUrl +'api/login/', data);
  }

  getMembers() {
    return this.http.get(this.apiUrl +'api/members/');
  }

  getMembershipRequest() {
    return this.http.get(this.apiUrl +'api/request/');
  }

  getOfficers() {
    return this.http.get(this.apiUrl +'api/getOfficers/');
  }

  acceptMember(data) {
    return this.http.post(this.apiUrl +'api/acceptMember/', data);
  }

  declineMember(data) {
    return this.http.post(this.apiUrl +'api/declineMember/', data);
  }

  promoteToOfficer(data) {
    return this.http.post(this.apiUrl +'api/promoteToOfficer/', data);
  }

  demoteToMember(data) {
    return this.http.post(this.apiUrl +'api/demoteToMember/', data);
  }

  getPosts() {
    return this.http.get(this.apiUrl +'api/getPosts/');
  }
  
  addPosts(data) {
    return this.http.post(this.apiUrl +'api/createPostFW/', data);
  }

  deletePosts(data) {
    return this.http.post(this.apiUrl +'api/deletePost/', data);
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

  getRecurringEvents() {
    return this.http.get(this.apiUrl +'api/getRecurringEvents/');
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
}
