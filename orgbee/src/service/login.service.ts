import { Injectable } from "@angular/core";
import {jwtDecode} from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  isAuthenticated: boolean = false;
  currentUserId: string | null = null; // Nullable type for the user ID

  setAuthStatus(status: boolean) {
    this.isAuthenticated = status;
  }

  getAuthStatus() {
    return this.isAuthenticated;
  }

  setCurrentUserId(userId: string | null) {
    this.currentUserId = userId;
  }

  getCurrentUserId(): string | null {
    return this.currentUserId;
  }

  extractUserIdFromToken(token: string): string | null {
    try {
      const decodedToken: any = jwtDecode(token);
      return decodedToken.sub; // Assuming 'sub' contains the user ID
    } catch (error) {
      console.error('Error decoding JWT:', error);
      return null;
    }
  }
}
