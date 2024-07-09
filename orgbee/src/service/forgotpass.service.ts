import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface ApiResponse {
  success: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ForgotPassService {
  private apiUrl = 'http://localhost:8000/api/auth';

  constructor(private http: HttpClient) {}

  sendResetLink(email: string): Observable<ApiResponse> {
    const url = `${this.apiUrl}/send-reset-link`;
    return this.http.post<ApiResponse>(url, { email });
  }

  verifyCode(email: string, token: string): Observable<ApiResponse> {
    const url = `${this.apiUrl}/verify-code`;
    return this.http.post<ApiResponse>(url, { email, token });
  }

  resetPassword(email: string, password: string, password_confirmation: string): Observable<ApiResponse> {
    const url = `${this.apiUrl}/reset-password`;
    return this.http.post<ApiResponse>(url, { email, password, password_confirmation });
  }
}
