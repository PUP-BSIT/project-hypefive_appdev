import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../service/data.service';
import { Response } from '../../app.component';
import { ToastrService } from 'ngx-toastr';

interface Member {
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
  details: Member [];
  membershipRequests: Member[];
  officers: Member[];
  student_num:string;
  response: Response;

  constructor(
    private dataService: DataService,
    private toastr: ToastrService) {}

  ngOnInit(): void{
    this.showMembers();
    this.showRequest();
    this.showOfficers();
    this.details = [];
    this.membershipRequests = [];
  }

  showMembers() {
    this.dataService.getMembers().subscribe((members: Member[]) => {
      this.members = members;
    });
  }

  showRequest() {
    this.dataService.getMembershipRequest()
      .subscribe((request: Member[]) => {
        this.membershipRequests = request;
    });
  }

  showOfficers() {
    this.dataService.getOfficers().subscribe((request: Member[]) => {
      this.officers = request;
    });
  }

  acceptRequest(student_number: string) {
    const data = {student_number: student_number };
    
    this.dataService.acceptMember(data).subscribe((res: Response) => {
      this.response = res;
      if (this.response.code === 200) {
        this.toastr.success(JSON.stringify(this.response.message), '',{
          timeOut: 2000,
          progressBar:true,
          toastClass: 'custom-toast success'
        });
      } else {
        this.toastr.error(JSON.stringify(this.response.message),'',{
          timeOut: 2000,
          progressBar:true,
          toastClass: 'custom-toast error'
        });
      }

      this.showRequest();
      this.showMembers();
    });
    
  }

  declineRequest(student_number: string) {
    const data = {student_number: student_number };

    this.dataService.declineMember(data).subscribe((res: Response) => {
      this.response = res;
      if (this.response.code === 200) {
        this.toastr.success(JSON.stringify(this.response.message), '',{
          timeOut: 2000,
          progressBar:true,
          toastClass: 'custom-toast success'
        });
      } else {
        this.toastr.error(JSON.stringify(this.response.message),'',{
          timeOut: 2000,
          progressBar:true,
          toastClass: 'custom-toast error'
        });
      }
      
      this.showRequest();
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
    this.details=[]; 
  }

  removeMember() {
    const data = {student_number: this.student_num };

    this.dataService.declineMember(data).subscribe((res: Response) => {
      this.response = res;
      if (this.response.code === 200) {
        this.toastr.success(JSON.stringify(this.response.message), '',{
          timeOut: 2000,
          progressBar:true,
          toastClass: 'custom-toast success'
        });
      } else {
        this.toastr.error(JSON.stringify(this.response.message),'',{
          timeOut: 2000,
          progressBar:true,
          toastClass: 'custom-toast error'
        });
      }

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
      if (this.response.code === 200) {
        this.toastr.success(JSON.stringify(this.response.message), '',{
          timeOut: 2000,
          progressBar:true,
          toastClass: 'custom-toast success'
        });
      } else {
        this.toastr.error(JSON.stringify(this.response.message),'',{
          timeOut: 2000,
          progressBar:true,
          toastClass: 'custom-toast error'
        });
      }

      this.showModalMember = false;
      this.showOfficers();
      this.details=[]; 
    });
  }

  demoteToMember() {
    const data = {student_number: this.student_num };
    
    this.dataService.demoteToMember(data).subscribe((res: Response) => {
      this.response = res;
      if (this.response.code === 200) {
        this.toastr.success(JSON.stringify(this.response.message), '',{
          timeOut: 2000,
          progressBar:true,
          toastClass: 'custom-toast success'
        });
      } else {
        this.toastr.error(JSON.stringify(this.response.message),'',{
          timeOut: 2000,
          progressBar:true,
          toastClass: 'custom-toast error'
        });
      }

      this.showModalOfficer = false;
      this.showOfficers();
      this.details=[]; 
    });
  }
}
