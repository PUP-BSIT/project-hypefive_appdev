import { Injectable } from "@angular/core";
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {jwtDecode} from "jwt-decode";

@Injectable({
  providedIn: 'root'
})

export class LoginService {
  isAuthenticated: boolean = false;
  isDataRetrieved: boolean = false;
  userInfo: any = {};
  onDataRetrievedCallbacks: Function[] = [];

  constructor(private router: Router, private http: HttpClient) {}

  setAuthStatus(status: boolean) {
    this.isAuthenticated = status;
  }

  getAuthStatus() {
    return this.isAuthenticated;
  }
//TODO: Ternal, April Joy A. revise code: use observable
  decodeToken(token: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const decodedToken: any = jwtDecode(token);
        this.userInfo.email = decodedToken.email;
        this.userInfo.id = decodedToken.user_id;
        const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
        this.getUserInfo(headers).then(() => resolve()).catch(error => reject(error));
      } catch (error) {
        console.error('Error decoding JWT token:', error);
        this.setAuthStatus(false);
        this.router.navigate(['login']);
        reject(error);
      }
    });
  }

  getUserInfo(headers: HttpHeaders): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.userInfo.id && this.userInfo.email) {
        this.http.get<any>(`http://127.0.0.1:8000/api/retrieve/${this.userInfo.id}&${this.userInfo.email}`, { headers })
          .subscribe(
            (data) => {
              this.userInfo.first_name = data.first_name;
              this.userInfo.last_name = data.last_name;
              this.userInfo.email = data.email;
              this.userInfo.student_number = data.student_number;
              this.userInfo.birthday = data.birthday;
              this.userInfo.gender = data.gender;
              this.userInfo.user_id = data.user_id;
              this.userInfo.role_id = data.role_id; 
              this.setAuthStatus(true);
              this.isDataRetrieved = true;
              this.invokeDataRetrievedCallbacks();
              resolve();
            },
            (error) => {
              console.error('Error fetching user info:', error);
              this.setAuthStatus(false);
              this.router.navigate(['login']);
              reject(error);
            }
          );
      } else {
        reject('User info incomplete');
      }
    });
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
