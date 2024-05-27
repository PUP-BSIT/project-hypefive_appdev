import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  //const apiUrl = ;

  constructor(private http:HttpClient) { }

  insertData(data){
    return this.http.post('http://127.0.0.1:8000/api/addStudent', data);
  }
}
