import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../service/data.service';

interface Member {
  first_name: string;
  last_name: string;
  birthday: Date;
  gender: string;
  student_number: string;
  email: string;
}

interface SelectedMember {
  first_name: string;
  last_name: string;
  birthday: Date;
  gender: string;
  student_number: string;
  email: string;
}

interface MembershipRequests {
  first_name: string;
  last_name: string;
}

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.css'],
})

export class MembersComponent implements OnInit {
  modalName = '';
  showModalMember = false;
  showModalOfficer = false;

  members: Member[];
  details: SelectedMember [];
  membershipRequests: MembershipRequests[];

  constructor(private dataService: DataService) {}

  ngOnInit(): void{
    this.dataService.getMembers().subscribe((members: Member[])=>{
      this.members = members;
    });
    this.details = [];
    this.membershipRequests=[];

    this.dataService.getMembershipRequest().subscribe((request: MembershipRequests[])=>{
      this.membershipRequests = request;
      console.log(this.membershipRequests);
    })
  }

  // members = [
  //   { name: 'John Doe', icon: '../../../assets/icon.jpg' },
  // ];

  // membershipRequests = [
  //   { name: 'Jane Smith', icon: '../../../assets/icon.jpg' },
  // ];

  officers = [
    { name: 'John Doe', icon: '../../../assets/icon.jpg' },
  ]

  

  memberClick(student_number: string) {
    const selectedMember = this.members.find(member => member.student_number === student_number);
    this.showModalMember = true;
    this.details.push(selectedMember);
  }

  officerClick() {
    this.showModalOfficer = true;
  }

  closeModal() {
    this.showModalMember = false;
    this.showModalOfficer = false;
    this.details=[];
  }

  // addOfficer(index: number) {
  //   const officer = this.members.splice(index, 1)[0];
  //   this.officers.push(officer);
  //   this.closeModal();
  // }

  // addMember(index: number) {
  //   const officerToMember = this.officers.splice(index, 1)[0];
  //   this.members.push(officerToMember);
  //   this.closeModal();
  // }

  removeMember(index: number) {
    this.members.splice(index, 1);
    this.closeModal();
  }

  removeOfficer(index:number) {
    this.officers.splice(index, 1);
    this.closeModal();
  }

  // acceptRequest(index: number) {
  //   const acceptedMember = this.membershipRequests.splice(index, 1)[0];
  //   this.members.push(acceptedMember);
  // }

  // declineRequest(index: number) {
  //   this.membershipRequests.splice(index, 1);
  // }
 
}
