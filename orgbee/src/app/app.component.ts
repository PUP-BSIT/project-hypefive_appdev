import { Component, OnInit } from '@angular/core';
import { LoginService, UserInfo } from '../service/login.service';
import { LoadingService } from '../service/loading.service';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
export interface Response {
  message: string;
  code: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})

export class AppComponent implements OnInit {
  title = 'homepage';
  userData: UserInfo; 

  constructor(private router: Router, private loadingService: LoadingService, private loginService: LoginService) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.loadingService.show();
      } else if (event instanceof NavigationEnd) {
        this.loadingService.hide();
      }
    });
  }
  isLoading: boolean = false;
  

  ngOnInit() {
    this.loginService.onDataRetrieved((data: UserInfo) => {
      this.userData = data;
    });
    this.loadingService.loading$.subscribe(isLoading => {
      this.isLoading = isLoading;
    });
  }

  isLoggedIn() {
    return this.loginService.getAuthStatus();
  }
}
