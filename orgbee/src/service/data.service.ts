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

  searchMember(data) {
    return this.http.get(this.apiUrl +
      `api/member/search_member?search_member=${data}`);
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
    
  getPostRequest(){
    return this.http.get(this.apiUrl +'api/getPostRequest/');
  }

  acceptPost(data){
    return this.http.post(this.apiUrl +'api/acceptPost/', data);
  }

  declinePost(data) {
    return this.http.post(this.apiUrl +'api/declinePost/', data);
  }

  getDeletionRequests(){
    return this.http.get(this.apiUrl +'api/getDeletionRequests/');
  }

  deletionRequest(data){
    return this.http.post(this.apiUrl +'api/deletionRequest/', data);
  }

  declineDeletionRequest(data){
    return this.http.post(this.apiUrl +'api/declineDeletionRequest/', data);
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
