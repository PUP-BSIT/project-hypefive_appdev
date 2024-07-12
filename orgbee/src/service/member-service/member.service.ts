import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface Member {
  id: number;
  first_name: string;
  last_name: string;
  birthday: Date;
  gender: string;
  student_number: string;
  email: string;
  icon_location:string;
}

@Injectable()

export class MemberService {

  constructor(private http:HttpClient) { }

  getMembers() {
    return this.http.get(environment.apiUrl +'/members/');
  }

  getMembershipRequest() {
    return this.http.get(environment.apiUrl +'/request/');
  }

  getOfficers() {
    return this.http.get(environment.apiUrl +'/getOfficers/');
  }

  acceptMember(data) {
    return this.http.post(environment.apiUrl +'/acceptMember/', data);
  }

  declineMember(data) {
    return this.http.post(environment.apiUrl +'/declineMember/', data);
  }

  promoteToOfficer(data) {
    return this.http.post(environment.apiUrl +'/promoteToOfficer/', data);
  }

  demoteToMember(data) {
    return this.http.post(environment.apiUrl +'/demoteToMember/', data);
  }

  searchMember(data) {
    return this.http.get(environment.apiUrl +
      `/member/search_member?search_member=${data}`);
  }
}
