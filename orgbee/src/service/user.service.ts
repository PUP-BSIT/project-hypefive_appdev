import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserInfo } from './login.service'; 
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://127.0.0.1:8000/api/update-student-info'; 
  constructor(private http: HttpClient, private loginService: LoginService) {}

  updateUserInfo(id: number, userInfo: UserInfo): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.loginService.getToken());
    return this.http.put<any>(`${this.apiUrl}/${id}`, userInfo, { headers });
  }
}  
