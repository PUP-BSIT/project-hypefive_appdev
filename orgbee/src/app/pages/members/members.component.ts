import { Component } from '@angular/core';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.css'],
})

export class MembersComponent {
  modalName = '';
  showModalMember = false;
  showModalOfficer = false;

  members = [
    { name: 'John Doe', icon: '../../../assets/icon.jpg' },
  ];

  membershipRequests = [
    { name: 'Jane Smith', icon: '../../../assets/icon.jpg' },
  ];

  officers = [
    { name: 'John Doe', icon: '../../../assets/icon.jpg' },
  ]

  details = [
    { 
      firstname: 'John',
      lastname: 'Doe',
      birthday: 'March 2, 2003',
      studentNumber: '2021-00000-TG-0',
      gender: 'Female',
      email: 'johndoe@gmail.com',
    },
  ]

  memberClick() {
    this.showModalMember = true;
  }

  officerClick() {
    this.showModalOfficer = true;
  }

  closeModal() {
    this.showModalMember = false;
    this.showModalOfficer = false;
  }

  addOfficer(index: number) {
    const officer = this.members.splice(index, 1)[0];
    this.officers.push(officer);
    this.closeModal();
  }

  addMember(index: number) {
    const officerToMember = this.officers.splice(index, 1)[0];
    this.members.push(officerToMember);
    this.closeModal();
  }

  removeMember(index: number) {
    this.members.splice(index, 1);
    this.closeModal();
  }

  removeOfficer(index:number) {
    this.officers.splice(index, 1);
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
