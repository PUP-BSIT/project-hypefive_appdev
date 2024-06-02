import { Component } from '@angular/core';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.css'],
})

export class MembersComponent {
  modalName = '';
  showModal = false;

  members = [
    { name: 'John Doe', icon: '../../../assets/icon.jpg' },
  ];

  membershipRequests = [
    { name: 'Jane Smith', icon: '../../../assets/icon.jpg' },
  ];

  officers = [
    { name: 'John Doe', icon: '../../../assets/icon.jpg' },
  ]

  memberClick(memberName: string) {
    this.showModal = true;
    this.modalName = memberName;
  }

  closeModal() {
    this.showModal = false;
  }

  removeMember(){
    this.members = this.members.filter(member => member.name !== this.modalName);
    this.closeModal();
  }

  acceptRequest(index: number) {
    const acceptedMember = this.membershipRequests.splice(index, 1)[0];
    this.members.push(acceptedMember);
  }

  declineRequest(index: number) {
    this.membershipRequests.splice(index, 1);
  }
}
