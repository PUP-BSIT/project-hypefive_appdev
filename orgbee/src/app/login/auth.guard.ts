import { Injectable } from "@angular/core";
import { CanActivate, Router } from '@angular/router';
import { LoginService } from '../../service/login.service';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private loginService: LoginService, private router: Router) {}

  canActivate(): Observable<boolean> {
    const token = this.loginService.getToken();
    if (token) {
      return this.loginService.decodeToken(token).pipe(
        switchMap(() => {
          if (this.loginService.getAuthStatus()) {
            return of(true);
          } else {
            this.router.navigate(['login']);
            return of(false);
          }
        }),
        catchError((error) => {
          this.router.navigate(['login']);
          return of(false);
        })
      );
    } else {
      this.router.navigate(['login']);
      return of(false);
    }
  }
}
