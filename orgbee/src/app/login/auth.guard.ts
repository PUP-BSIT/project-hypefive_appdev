import { Injectable } from "@angular/core";
import { CanActivate, Router } from '@angular/router';
import { LoginService } from '../../service/login.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(private loginService: LoginService, private router: Router) {}

    canActivate(): Promise<boolean> {
        const token = this.loginService.getToken();
        if (token) {
            return this.loginService.decodeToken(token).then(() => {
                if (this.loginService.getAuthStatus()) {
                    return true;
                } else {
                    this.router.navigate(['login']);
                    return false;
                }
            }).catch(() => {
                this.router.navigate(['login']);
                return false;
            });
        } else {
            this.router.navigate(['login']);
            return Promise.resolve(false);
        }
    }
}
