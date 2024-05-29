import { Injectable } from "@angular/core";
import { CanActivate, Router } from '@angular/router';
import { LoginService } from '../../service/login.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(private loginService: LoginService, private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('token');
    if (token) {
      this.loginService.setAuthStatus(true); // User is authenticated
      return true;
    } else {
      this.loginService.setAuthStatus(false); // User is not authenticated
      this.router.navigate(['login']);
      return false; 
    }
  }
}