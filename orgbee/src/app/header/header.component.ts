import { Component, Input, OnInit } from '@angular/core';
import { LoginService, UserInfo } from '../../service/login.service';

enum Roles {
  Student = 1,
  Officer = 2,
  Admin = 3
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})


export class HeaderComponent implements OnInit {
  @Input() title: string;
  @Input() orgName: string = ''; // Default value
  @Input() showImage: boolean = true; 
  @Input() height: string = 'default-height'; 
  userInfo: UserInfo;

  constructor(private loginService: LoginService) { }

  ngOnInit(): void {
    this.loginService.onDataRetrieved((data: UserInfo) => {
      this.userInfo = data;
    });
}

getRoleName(roleId: number): string {
  return Roles[roleId] || 'Unknown Role';
}

getHeaderClasses(): string {
  switch (this.userInfo.role_id) {
    case Roles.Student:
      return 'student';
    case Roles.Officer:
      return 'officer';
    case Roles.Admin:
      return 'admin';
    default:
      return ''; 
  }
}
}
