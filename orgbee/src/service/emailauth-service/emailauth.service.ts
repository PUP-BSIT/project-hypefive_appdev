// C:\repos\project-hypefive_appdev\orgbee\src\service\verify.service.ts
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
export class EmailAuthService {

  constructor(private http: HttpClient) {}

  verifyEmail(token: string): Observable<ApiResponse> {
    const url =  environment.apiUrl + `/verify`;
    return this.http.post<ApiResponse>(url, { token });
  }
}
