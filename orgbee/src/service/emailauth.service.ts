// C:\repos\project-hypefive_appdev\orgbee\src\service\verify.service.ts
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
export class EmailAuthService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  verifyEmail(token: string): Observable<ApiResponse> {
    const url = `${this.apiUrl}/verify`;
    return this.http.post<ApiResponse>(url, { token });
  }
}
