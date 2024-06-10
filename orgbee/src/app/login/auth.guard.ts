import { Injectable } from "@angular/core";
import { CanActivate, Router } from '@angular/router';
import { LoginService } from '../../service/login.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private loginService: LoginService,
    private router: Router,
    private jwtHelper: JwtHelperService
  ) {}

  canActivate() {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        if (!this.jwtHelper.isTokenExpired(token)) {
          this.loginService.setAuthStatus(true); // User is authenticated
          return true;
        } else {
          throw new Error('Token expired');
        }
      } catch (error) {
        //TODO: VILLA-VILLA: Create a toastr popup for this.
        console.error('Invalid token or token expired:', error);
        this.handleInvalidToken();
        return false;
      }
    } else {
      this.handleInvalidToken();
      return false;
    }
  }

  private handleInvalidToken() {
    this.loginService.setAuthStatus(false); // User is not authenticated
    localStorage.removeItem('token'); // Remove expired or invalid token
    this.router.navigate(['login']);
  }
}
