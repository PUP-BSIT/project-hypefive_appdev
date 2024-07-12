import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment'

interface ApiResponse {
  success: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ForgotPassService {

  constructor(private http: HttpClient) {}

  sendResetLink(email: string): Observable<ApiResponse> {
    const url = environment.apiUrl + '/auth/send-reset-link';
    return this.http.post<ApiResponse>(url, { email });
  }

  verifyCode(email: string, token: string): Observable<ApiResponse> {
    const url = environment.apiUrl + `/auth/verify-code`;
    return this.http.post<ApiResponse>(url, { email, token });
  }

  resetPassword(email: string, password: string, password_confirmation: string): Observable<ApiResponse> {
    const url = environment.apiUrl + `/auth/reset-password`;
    return this.http.post<ApiResponse>(url, { email, password, password_confirmation });
  }
}
