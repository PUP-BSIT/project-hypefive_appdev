import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../service/data.service';
import { Response } from '../../app.component';
import { ToastrService } from 'ngx-toastr';
import { LoginService, UserInfo } from '../../../service/login.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { EMPTY, catchError, debounceTime, switchMap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog.component';

export interface Member {
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
  officers: Member[] =[];
  student_num:string;
  response: Response;
  userInfo: UserInfo;
  searchMember: FormGroup;
  retrievedMember: Member[];
  isSearchResult = false;
  constructor(
    private dataService: DataService,
    private toastr: ToastrService,
    private fb:FormBuilder,
    public dialog: MatDialog,
   private loginService: LoginService) {}

  ngOnInit(): void{
    this.searchMember = this.fb.group({keyword:['']});
    this.showMembers();
    this.showRequest();
    this.showOfficers();
    this.searchMembers();
    this.details = [];
    this.membershipRequests = [];
    this.loginService.onDataRetrieved((data: UserInfo) => {
      this.userInfo = data;
    });
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
    this.confirmAction('Decline Confirmation', 'Are you sure you want to decline this membership request?', () => {
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

  confirmAction(title: string, message: string, callback: () => void) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '300px',
      data: { title: title, message: message }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        callback();
      }
    });
  }

  removeMember() {
  this.confirmAction('Confirm Removal', 'Are you sure you want to remove this member?', () => {
    const data = { student_number: this.student_num };

    this.dataService.declineMember(data).subscribe((res: Response) => {
      this.response = res;
      if (this.response.code === 200) {
        this.toastr.success(JSON.stringify(this.response.message), '', {
          timeOut: 2000,
          progressBar: true,
          toastClass: 'custom-toast success'
        });
      } else {
        this.toastr.error(JSON.stringify(this.response.message), '', {
          timeOut: 2000,
          progressBar: true,
          toastClass: 'custom-toast error'
        });
      }

      this.showModalMember = false;
      this.showModalOfficer = false;
      this.details = [];
      this.student_num = '';

      this.showMembers(); // Refresh members list
      this.showOfficers(); // Refresh officers list
    });
  });
}


  promoteToOfficer() {
    this.confirmAction('Confirm Promotion', 'Are you sure you want to promote this member to officer?', () => {
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
  });
}

  demoteToMember() {
    this.confirmAction('Confirm Demotion', 'Are you sure you want to demote this officer?', () => {
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

      this.showModalMember = false;
      this.showModalOfficer = false;
      this.showOfficers();
      this.details=[]; 
    });
  });
}

  searchMembers() {
    this.searchMember.get('keyword')!.valueChanges.pipe(
      switchMap((keyword)=>{
        console.log(keyword);
        return this.dataService.searchMember(keyword).pipe(
          debounceTime(2000),
          catchError((error: HttpErrorResponse)=>{
            console.log(error);
            return EMPTY;
        }))
        
      }))
      .subscribe((value:Member[] | Response)=>{
        if (Array.isArray(value)){
          this.retrievedMember=value;
          this.response = null;
        } else{
          this.retrievedMember=[];
          this.response = value;
        }
      });
  }

  seeResults(){
    this.isSearchResult=true;
  }

  exitSearch(){
    this.retrievedMember = [];
    this.isSearchResult = false;
  }

  isMemberAnOfficer(studentNumber: string): boolean {
    return this.officers.some(officer => officer.student_number === studentNumber);
  }
  
}