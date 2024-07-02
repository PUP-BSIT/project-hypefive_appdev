import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserInfo } from './login.service'; 
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://127.0.0.1:8000/api/'; 
  constructor(private http: HttpClient, private loginService: LoginService) {}

  updateUserInfo(userInfo: UserInfo): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.loginService.getToken());
    return this.http.put<any>(`${this.apiUrl}update-student-info`, userInfo, { headers });
  }


  changePassword(currentPassword: string, newPassword: string, confirm_password: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.loginService.getToken());
     const body = {
        current_password: currentPassword,
        new_password: newPassword,
        confirm_password: confirm_password 
      };
      return this.http.put<any>(`${this.apiUrl}change-password`, body, { headers });
    }

    deactivateUser(userId: number, password: string): Observable<any> {
      return this.http.post<any>(`${this.apiUrl}users/deactivate/${userId}`, { password });
  }
  
}
