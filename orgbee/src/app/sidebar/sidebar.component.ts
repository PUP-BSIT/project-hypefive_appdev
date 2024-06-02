import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../service/login.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  constructor(private router: Router,
    private loginService: LoginService
  ) {}
  userInfo: any = {};
  navigateTo(page: string) {
    this.router.navigate([page]);
  }

  ngOnInit(): void {
    this.loginService.onDataRetrieved((data: any) => {
      this.userInfo = data;
      console.log('User information retrieved:', this.userInfo);
    });
  }
}
