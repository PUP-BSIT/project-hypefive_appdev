import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class DataService {
  apiUrl = 'http://127.0.0.1:8000/';
  // apiUrl = 'https://orgbee.online/';

  constructor(private http:HttpClient) { }

  registerUser(data){
    return this.http.post(this.apiUrl +'api/register/', data);
  }

  login(data) {
    return this.http.post(this.apiUrl +'api/login/', data);
  }
}
