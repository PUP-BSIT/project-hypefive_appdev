import { Injectable } from "@angular/core";
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {jwtDecode} from "jwt-decode";
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface UserInfo {
  email: string;
  id: number;
  first_name?: string;
  last_name?: string;
  student_number?: string;
  birthday?: string;
  gender?: string;
  user_id?: number;
  role_id?: number;
  icon_id?: number;
  icon_path?: string;
}

interface UserDataResponse {
  first_name: string;
  last_name: string;
  email: string;
  student_number: string;
  birthday: string;
  gender: string;
  user_id: number;
  role_id: number;
  icon_id: number;
}

@Injectable()

export class LoginService {
  isAuthenticated: boolean = false;
  isDataRetrieved: boolean = false;
  userInfo: UserInfo = {
    email: '',
    id: 0
  };
  onDataRetrievedCallbacks: Function[] = [];

  constructor(private router: Router, private http: HttpClient) {}
  
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

  setAuthStatus(status: boolean) {
    this.isAuthenticated = status;
  }

  getAuthStatus() {
    return this.isAuthenticated;
  }

  decodeToken(token: string): Observable<void> {
    return new Observable<void>(observer => {
      try {
        if (this.isTokenExpired(token)) {
          this.setAuthStatus(false);
          this.router.navigate(['login']);
          observer.error('Token expired');
          return;
        }

        const decodedToken: any = jwtDecode(token);
        this.userInfo.email = decodedToken.email;
        this.userInfo.id = decodedToken.user_id;
        const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);

        this.getUserInfo(headers).subscribe({
          next: () => {
            observer.next();
            observer.complete();
          },
          error: (error) => {
            console.error('Error fetching user info:', error);
            this.setAuthStatus(false);
            this.router.navigate(['login']);
            observer.error(error);
          }
        });
      } catch (error) {
        console.error('Error decoding JWT token:', error);
        this.setAuthStatus(false);
        this.router.navigate(['login']);
        observer.error(error);
      }
    });
  }

  isTokenExpired(token: string): boolean {
    try {
      const decodedToken: any = jwtDecode(token);
      const exp = decodedToken.exp;
      return Date.now() >= exp * 1000;
    } catch (e) {
      console.error('Error decoding JWT token:', e);
      return true;
    }
  }

  getUserInfo(headers: HttpHeaders): Observable<void> {
    if (this.userInfo.id && this.userInfo.email) {
      return this.http.get<UserDataResponse>(`http://127.0.0.1:8000/api/retrieve/${this.userInfo.id}&${this.userInfo.email}`, { headers })
        .pipe(
          map((data: UserDataResponse) => {
            this.userInfo.first_name = data.first_name;
            this.userInfo.last_name = data.last_name;
            this.userInfo.email = data.email;
            this.userInfo.student_number = data.student_number;
            this.userInfo.birthday = data.birthday;
            this.userInfo.gender = data.gender;
            this.userInfo.user_id = data.user_id;
            this.userInfo.role_id = data.role_id;
            this.userInfo.icon_id = data.icon_id;
            this.userInfo.icon_path = this.getIconPath(data.icon_id);
            this.setAuthStatus(true);
            this.isDataRetrieved = true;
            this.invokeDataRetrievedCallbacks();
          }),
          catchError((error) => {
            console.error('Error fetching user info:', error);
            this.setAuthStatus(false);
            this.router.navigate(['login']);
            return throwError(error);
          })
        );
    } else {
      return throwError('User info incomplete');
    }
  }

  private getIconPath(iconId: number): string {
    return this.iconPaths[iconId];
  }

  //TODO (move this to user service)
  updateIconId(iconId: number): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.getToken());
    return this.http.put<any>(`http://127.0.0.1:8000/api/students/update-icon`, { icon_id: iconId }, { headers }).pipe(
      map((data: any) => {
        this.userInfo.icon_id = iconId;
        this.userInfo.icon_path = this.getIconPath(iconId);
        return data; 
      }),
      catchError((error) => {
        console.error('Error updating icon:', error);
        return throwError(error);
      })
    );
  }

  private invokeDataRetrievedCallbacks() {
    if (this.isDataRetrieved) {
      this.onDataRetrievedCallbacks.forEach(callback => callback(this.userInfo));
      this.onDataRetrievedCallbacks = [];
    }
  }

  onDataRetrieved(callback: Function) {
    if (this.isDataRetrieved) {
      callback(this.userInfo);
    } else {
      this.onDataRetrievedCallbacks.push(callback);
    }
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
