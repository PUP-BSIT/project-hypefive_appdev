import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  isAuthenticated: boolean = false;

  setAuthStatus(status: boolean) {
    this.isAuthenticated = status;
  }

  getAuthStatus() {
    return this.isAuthenticated;
  }
}