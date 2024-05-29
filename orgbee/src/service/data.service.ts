import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  apiUrl = 'http://127.0.0.1:8000/';

  constructor(private http:HttpClient) { }

  registerUser(data){
    return this.http.post(this.apiUrl +'api/register/', data);
  }
}
