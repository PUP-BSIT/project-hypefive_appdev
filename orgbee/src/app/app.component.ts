import { Component } from '@angular/core';
import { LoginService } from '../service/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'homepage';
  constructor(private loginService: LoginService) {}

  isLoggedIn() {
    return this.loginService.getAuthStatus();
  }
}

