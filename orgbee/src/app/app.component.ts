import { Component, OnInit } from '@angular/core';
import { LoginService } from '../service/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'homepage';
  userData: any; // Variable to store retrieved user data

  constructor(private loginService: LoginService) {}

  ngOnInit() {
  }

  isLoggedIn() {
    return this.loginService.getAuthStatus();
  }
}
