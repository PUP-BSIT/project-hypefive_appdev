import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, catchError, throwError } from 'rxjs';
import { UserInfo } from '../login-service/login.service'; 
import { LoginService } from '../login-service/login.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private loginService: LoginService) {}

  updateUserInfo(userInfo: UserInfo): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.loginService.getToken());
    return this.http.put<any>(environment.apiUrl +
      `/update-student-info`, userInfo, { headers }).pipe(
      map((response: any) => {
        if (response && response.updated_student) {
          this.loginService.userInfo.first_name = response.updated_student.first_name;
          this.loginService.userInfo.last_name = response.updated_student.last_name;
          this.loginService.userInfo.birthday = response.updated_student.birthday;
          this.loginService.userInfo.gender = response.updated_student.gender;
          this.loginService.userInfo.student_number = response.updated_student.student_number;
        } else {
          console.error('Invalid response format:', response);
        }
        return response;
      }),
      catchError((error) => {
        console.error('Error updating user info:', error);
        return throwError(error);
      })
    );
  }
  

    //TODO (move this to user service)
    updateIconId(iconId: number): Observable<any> {
      const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.loginService.getToken());
      return this.http.put<any>(environment.apiUrl +
        `/students/update-icon`, { icon_id: iconId }, { headers }).pipe(
          map((data: any) => {
            // Access userInfo via LoginService
            this.loginService.userInfo.icon_id = iconId;
            this.loginService.userInfo.icon_path = this.getIconPath(iconId);
            return data;
          }),
          catchError((error) => {
            console.error('Error updating icon:', error);
            return throwError(error);
          })
        );
    }

    private getIconPath(iconId: number): string {
      return this.iconPaths[iconId];
    }
    
    private iconPaths: { [key: number]: string } = {
      1: 'assets/icons/1.png',
      2: 'assets/icons/2.png',
      3: 'assets/icons/3.png',
      4: 'assets/icons/4.png',
      5: 'assets/icons/5.png',
      6: 'assets/icons/6.png',
      7: 'assets/icons/7.png',
      8: 'assets/icons/8.png',
      9: 'assets/icons/9.png',
      10: 'assets/icons/10.png'
    };
  
  changePassword(currentPassword: string, newPassword: string, confirm_password: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.loginService.getToken());
     const body = {
        current_password: currentPassword,
        new_password: newPassword,
        confirm_password: confirm_password 
      };
      return this.http.put<any>(environment.apiUrl +
      `/change-password`, body, { headers });
    }

    deactivateUser(userId: number, password: string): Observable<any> {
      return this.http.post<any>(environment.apiUrl +
      `/users/deactivate/${userId}`, { password });
    }
  
    deleteUser(userId: number, password: string): Observable<any> {
      return this.http.post<any>(environment.apiUrl +
      `/users/delete/${userId}`, {password});
    }
}
