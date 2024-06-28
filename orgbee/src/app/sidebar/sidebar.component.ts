import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService, UserInfo } from '../../service/login.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  userInfo: UserInfo;

  constructor(private router: Router, private loginService: LoginService) {}

  navigateTo(page: string) {
    this.router.navigate([page]);
  }

  ngOnInit(): void {
    this.loginService.onDataRetrieved((data: UserInfo) => {
      this.userInfo = data;
    });
  }
}
