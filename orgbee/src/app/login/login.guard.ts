import { Injectable } from "@angular/core";
import { CanActivate, Router } from '@angular/router';
import { LoginService } from '../../service/login.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(private loginService: LoginService, private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('token');
    if (token && !this.loginService.isTokenExpired(token)) {
      this.router.navigate(['/']);
      return false;
    } else {
      return true;
    }
  }
}
