import { Component } from '@angular/core';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrl: './members.component.css',
})
export class MembersComponent {
  modalName = '';
  showModal = false;

  memberClick(memberName: string) {
    this.showModal = true;
    this.modalName = memberName;
  }

  closeModal() {
    this.showModal = false;
  }
}
