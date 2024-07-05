import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface Post {
  subject: string;
  content: string;
  background_color: string;
  showOptions?: boolean;
  id?: number; // for sample only
  post_status_id: number; //Update to status
  student_id: number;
  deletion_req_count?: number;
}
@Injectable()
export class FreedomwallService {

  constructor(private http:HttpClient) { }

  getPosts() {
    return this.http.get(environment.apiUrl +'/getPosts/');
  }
  
  addPosts(data) {
    return this.http.post(environment.apiUrl +'/createPostFW/', data);
  }

  deletePosts(data) {
    return this.http.post(environment.apiUrl +'/deletePost/', data);
  }
      
  getPostRequest(){
    return this.http.get(environment.apiUrl +'/getPostRequest/');
  }

  acceptPost(data){
    return this.http.post(environment.apiUrl +'/acceptPost/', data);
  }

  declinePost(data) {
    return this.http.post(environment.apiUrl +'/declinePost/', data);
  }

  getDeletionRequests(){
    return this.http.get(environment.apiUrl +'/getDeletionRequests/');
  }

  deletionRequest(data){
    return this.http.post(environment.apiUrl +'/deletionRequest/', data);
  }

  declineDeletionRequest(data){
    return this.http.post(environment.apiUrl +'/declineDeletionRequest/', data);
  }
}
