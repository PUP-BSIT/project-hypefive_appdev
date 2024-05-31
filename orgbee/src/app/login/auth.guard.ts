import { Injectable } from "@angular/core";
import { CanActivate, Router } from '@angular/router';
import { LoginService } from '../../service/login.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(
        private loginService: LoginService,
        private router: Router
    ) {}

    canActivate(): boolean {
        const token = localStorage.getItem('token');
        if (token) {
            // Extract user ID from token
            const userId = this.loginService.extractUserIdFromToken(token);

            if (userId) {
                // Set current user ID in the service
                this.loginService.setCurrentUserId(userId);
                // Set authentication status
                this.loginService.setAuthStatus(true);
                return true;
            } else {
                console.error('Error extracting user ID from token.');
            }
        }
        
        // If token is not available or user ID extraction fails, navigate to login page
        this.loginService.setAuthStatus(false);
        this.router.navigate(['login']);
        return false;
    }
}
