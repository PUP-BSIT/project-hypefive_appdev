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
  birthday: Date;
  gender: string;
  student_number: string;
  email: string;
}

interface Officers {
  first_name: string;
  last_name: string;
  birthday: Date;
  gender: string;
  student_number: string;
  email: string;
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
  officers: Officers[];
  // TODO: VILLA-VILLA: remove the "any" data type
  response:any;
  constructor(private dataService: DataService) {}

  ngOnInit(): void{
    this.showMembers();
    this.showRequest();
    this.showOfficers();
    this.details = [];
    this.membershipRequests=[];
  }

  showMembers() {
    this.dataService.getMembers().subscribe((members: Member[])=>{
      this.members = members;
    });
  }

  showRequest() {
    this.dataService.getMembershipRequest().subscribe((request: MembershipRequests[])=>{
      this.membershipRequests = request;
      console.log(this.membershipRequests);
    })
  }

  showOfficers() {
    this.dataService.getOfficers().subscribe((request: Officers[])=>{
      this.officers = request;
      console.log(this.officers);
    })
  }
  // officers = [
  //   { name: 'John Doe', icon: '../../../assets/icon.jpg' },
  // ]

  acceptRequest(student_number: string) {
    const data = {student_number: student_number };
    console.log(data);
    this.dataService.acceptMember(data).subscribe(res => {
      this.response = res;

      // Remove the accepted student from the membershipRequests array
      this.membershipRequests = this.membershipRequests.filter(request => request.student_number !== student_number);
      this.showMembers();
    });
    
  }

  declineRequest(student_number: string) {
    const data = {student_number: student_number };
    console.log(data);
    this.dataService.declineMember(data).subscribe(res => {
      this.response = res;
      console.log(this.response);
      
      // Remove the accepted student from the membershipRequests array
      this.membershipRequests = this.membershipRequests.filter(request => request.student_number !== student_number);
      this.showRequest();
    });
  }

  memberClick(student_number: string) {
    const selectedMember = this.members.find(member => member.student_number === student_number);
    this.showModalMember = true;
    this.details.push(selectedMember);
  }

  officerClick(student_number: string) {
    const selectedMember = this.members.find(member => member.student_number === student_number);
    this.showModalMember = true;
    this.details.push(selectedMember);
  }

  closeModal() {
    this.showModalMember = false;
    this.showModalOfficer = false;
    this.details=[]; //Empty details
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

  // removeMember(index: number) {
  //   this.members.splice(index, 1);
  //   this.closeModal();
  // }

  // removeOfficer(index:number) {
  //   this.officers.splice(index, 1);
  //   this.closeModal();
  // }

  
 
}
