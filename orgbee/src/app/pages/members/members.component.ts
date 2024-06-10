import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../service/data.service';
import { Response } from '../../app.component';
interface Member {
  first_name: string;
  last_name: string;
  birthday: Date;
  gender: string;
  student_number: string;
  email: string;
  icon_location:string;
}

interface SelectedMember {
  first_name: string;
  last_name: string;
  birthday: Date;
  gender: string;
  student_number: string;
  email: string;
  icon_location:string;
}

interface MembershipRequests {
  first_name: string;
  last_name: string;
  birthday: Date;
  gender: string;
  student_number: string;
  email: string;
  icon_location:string;
}

interface Officers {
  first_name: string;
  last_name: string;
  birthday: Date;
  gender: string;
  student_number: string;
  email: string;
  icon_location:string;
}

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.css'],
})

export class MembersComponent implements OnInit {
  showModalMember = false;
  showModalOfficer = false;

  members: Member[];
  details: SelectedMember [];
  membershipRequests: MembershipRequests[];
  officers: Officers[];
  student_num:string;
  response: Response;

  constructor(private dataService: DataService) {}

  ngOnInit(): void{
    this.showMembers();
    this.showRequest();
    this.showOfficers();
    this.details = [];
    this.membershipRequests = [];
  }

  showMembers() {
    this.dataService.getMembers().subscribe((members: Member[])=>{
      this.members = members;
    });
  }

  showRequest() {
    this.dataService.getMembershipRequest()
      .subscribe((request: MembershipRequests[])=>{
        this.membershipRequests = request;
    });
  }

  showOfficers() {
    this.dataService.getOfficers().subscribe((request: Officers[])=>{
      this.officers = request;
    });
  }

  acceptRequest(student_number: string) {
    const data = {student_number: student_number };
    
    this.dataService.acceptMember(data).subscribe((res: Response) => {
      this.response = res;
      // Remove the accepted student from the membershipRequests array
      this.membershipRequests = this.membershipRequests
        .filter(request => request.student_number !== student_number);
      this.showMembers();
    });
    
  }

  declineRequest(student_number: string) {
    const data = {student_number: student_number };

    this.dataService.declineMember(data).subscribe((res: Response) => {
      this.response = res;
      // Remove the accepted student from the membershipRequests array
      this.membershipRequests = this.membershipRequests
        .filter(request => request.student_number !== student_number);
      this.showRequest();
    });
  }
  
  memberClick(student_number: string) {
    const selectedMember = this.members
      .find(member => member.student_number === student_number);
    this.showModalMember = true;
    this.details.push(selectedMember);
    this.student_num=student_number;
  }

  officerClick(student_number: string) {
    const selectedMember = this.members
      .find(member => member.student_number === student_number);
    this.showModalOfficer = true;
    this.details.push(selectedMember);
    this.student_num=student_number;
  }

  closeModal() {
    this.showModalMember = false;
    this.showModalOfficer = false;
    this.details=[]; //Empty details
  }

  removeMember() {
    const data = {student_number: this.student_num };

    this.dataService.declineMember(data).subscribe((res: Response) => {
      this.response = res;

      this.showModalMember = false;
      this.showModalOfficer = false;

      this.details=[]; 
      this.student_num ='';
      
      this.showMembers();
      this.showOfficers();
    });
  }

  promoteToOfficer() {
    const data = {student_number: this.student_num };
    
    this.dataService.promoteToOfficer(data).subscribe((res: Response) => {
      this.response = res;
      this.showModalMember = false;
      this.showOfficers();
      this.details=[]; 
    });
  }

  demoteToMember() {
    const data = {student_number: this.student_num };
    
    this.dataService.demoteToMember(data).subscribe((res: Response) => {
      this.response = res;
      this.showModalOfficer = false;
      this.showOfficers();
      this.details=[]; 
    });
  }
}
