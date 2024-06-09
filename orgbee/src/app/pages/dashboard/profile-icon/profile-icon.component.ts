import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-profile-icon',
  templateUrl: './profile-icon.component.html',
  styleUrls: ['./profile-icon.component.css']
})
export class ProfileIconComponent {
  @Input() showProfileIconEdit: boolean = false;
  @Output() close: EventEmitter<void> = new EventEmitter<void>();
  selectedAvatarPath: string = 'assets/default.jpg'; // Default avatar path

  selectAvatar(avatarPath: string): void {
    this.selectedAvatarPath = avatarPath; // Update selected avatar path
  }
  closeOverlay() {
    this.close.emit();
  }
}
