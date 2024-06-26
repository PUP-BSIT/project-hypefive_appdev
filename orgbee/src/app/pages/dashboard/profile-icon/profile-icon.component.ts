import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { LoginService, UserInfo } from '../../../../service/login.service';

@Component({
  selector: 'app-profile-icon',
  templateUrl: './profile-icon.component.html',
  styleUrls: ['./profile-icon.component.css']
})
export class ProfileIconComponent implements OnInit {
  @Input() showProfileIconEdit: boolean = false;
  @Output() close: EventEmitter<void> = new EventEmitter<void>();
  selectedAvatarPath: string = ''; 
  currentSelectedAvatar: string = ''; 
  userInfo: UserInfo;

  constructor(private loginService: LoginService) {}

  ngOnInit(): void {
    this.loginService.onDataRetrieved((data: UserInfo) => {
      this.userInfo = data;
      console.log(data);
      this.selectedAvatarPath = `assets/icons/${this.userInfo.icon_id}.png`; 
    });
  }

  selectAvatar(avatarPath: string): void {
    this.selectedAvatarPath = avatarPath; 
    this.currentSelectedAvatar = avatarPath; 
  }

  closeModal() {
    this.showProfileIconEdit = false;
    this.close.emit(); 
  }

  saveAvatar() {
    this.loginService.updateIconId(this.getIconIdFromPath(this.selectedAvatarPath)).subscribe(
      response => {
        console.log('Icon updated successfully:', response);
      },
      error => {
        console.error('Failed to update icon:', error);
      }
    );
    this.closeModal();
  }

  private getIconIdFromPath(iconPath: string): number {
    const iconId = parseInt(iconPath.split('/').pop().split('.')[0]);
    return iconId;
  }
}
