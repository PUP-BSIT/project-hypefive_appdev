import { Component, OnInit } from '@angular/core';
import { LoginService, UserInfo } from '../service/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'homepage';
  userData: UserInfo; 

  constructor(private loginService: LoginService) {}

  ngOnInit() {
    this.loginService.onDataRetrieved((data: UserInfo) => {
      this.userData = data;
    });
  }

  isLoggedIn() {
    return this.loginService.getAuthStatus();
  }
}
