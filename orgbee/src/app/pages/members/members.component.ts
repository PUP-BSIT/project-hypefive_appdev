import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder } from '@angular/forms';
import { EMPTY, catchError, debounceTime, switchMap } from 'rxjs';
import { of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';

import { MemberService } from '../../../service/member-service/member.service';
import { Member } from '../../../service/member-service/member.service';
import { LoginService, UserInfo } 
  from '../../../service/login-service/login.service';
import { ConfirmationDialogComponent } 
  from '../../confirmation-dialog/confirmation-dialog.component';
import { SpinnerService } 
  from '../../../service/spinner-service/spinner.service';
import { ResponseService } 
  from '../../../service/response-service/response.service';
import { Response } from '../../../service/response-service/response.service';



@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.css'],
})

export class MembersComponent implements OnInit {
  members: Member[];
  details: Member [];
  membershipRequests: Member[];
  officers: Member[] =[];
  retrievedMember: Member[];
  response: Response;
  userInfo: UserInfo;
  searchMember: FormGroup;
  student_num: string;

  showModalMember = false;
  showModalOfficer = false;
  isSearchResult = false;
  requestMemberBtn = false;

  constructor(
    private memberService: MemberService,
    private toastr: ToastrService,
    private fb:FormBuilder,
    public dialog: MatDialog,
    private loginService: LoginService,
    private spinnerService: SpinnerService,
    private responseService: ResponseService) {}

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
    this.memberService.getMembers().pipe(
      catchError((error) => {
        if (!navigator.onLine) {
          this.responseService.handleError
            ('You are offline. Please check your internet connection.');
        } else {
          this.responseService.handleError
            (`An error occurred while fetching members. 
              Please try again.`);
        }

        // Return an empty observable to complete the pipe
        return of(null);
      })
    ).subscribe((members: Member[]) => {
      this.members = members;
    });
  }

  showRequest() {
    this.memberService.getMembershipRequest().pipe(
      catchError((error) => {
        this.spinnerService.hide();

        if (!navigator.onLine) {
          this.responseService.handleError
            ('You are offline. Please check your internet connection.');
        } else {
          this.responseService.handleError
            (`An error occurred while fetching membership requests. 
              Please try again.`);
        }

        // Return an empty observable to complete the pipe
        return of(null);
      })
    ).subscribe((request: Member[]) => {
        this.membershipRequests = request;
    });
  }

  showOfficers() {
    this.memberService.getOfficers().pipe(
      catchError((error) => {
        this.spinnerService.hide();

        if (!navigator.onLine) {
          this.responseService.handleError
            ('You are offline. Please check your internet connection.');
        } else {
          this.responseService.handleError
            (`An error occurred while fetching officers. 
              Please try again.`);
        }

        // Return an empty observable to complete the pipe
        return of(null);
      })
    ).subscribe((request: Member[]) => {
      this.officers = request;
    });
  }

  acceptRequest(student_number: string) {
    this.confirmAction('Accept Confirmation', 
      'Are you sure you want to accept this membership request?', () => {
        this.spinnerService.show('Accepting membership request...')
        const data = {student_number: student_number };
        
        this.memberService.acceptMember(data).pipe(
          catchError((error) => {
            this.spinnerService.hide();
    
            if (!navigator.onLine) {
              this.responseService.handleError
                ('You are offline. Please check your internet connection.');
            } else {
              this.responseService.handleError
                (`An error occurred while accepting the membership request. 
                  Please try again.`);
            }
    
            // Return an empty observable to complete the pipe
            return of(null);
          })
        ).subscribe((res: Response) => {
          this.response = res;
          setTimeout(() => {
            this.spinnerService.hide();
            this.responseService.handleResponse(this.response);

            this.showRequest();
            this.showMembers();
          }, 500);
        });
    });
  }

  declineRequest(student_number: string) {
    this.confirmAction('Decline Confirmation', 
      'Are you sure you want to decline this membership request?', () => {
        this.spinnerService.show('Declining membership request...')
        const data = {student_number: student_number };
        this.memberService.declineMember(data).pipe(
          catchError((error) => {
            this.spinnerService.hide();
    
            if (!navigator.onLine) {
              this.responseService.handleError
                ('You are offline. Please check your internet connection.');
            } else {
              this.responseService.handleError
                (`An error occurred while declining the membership request. 
                  Please try again.`);
            }
    
            // Return an empty observable to complete the pipe
            return of(null);
          })
        ).subscribe((res: Response) => {
          this.response = res;
          setTimeout(() => {
            this.spinnerService.hide();
            this.responseService.handleResponse(this.response);

            this.showRequest();
          }, 500);
        });
    });
  }
  
  memberClick(student_number: string) {
    const selectedMember = this.members
      .find(member => member.student_number === student_number);
    
    this.showModalMember = true;
    this.requestMemberBtn = false;
    this.details.push(selectedMember);
    this.student_num=student_number;
  }

  reqMemberClick(student_number: string) {
    const selectedMember = this.membershipRequests
      .find(member => member.student_number === student_number);
    
    this.showModalMember = true;
    this.requestMemberBtn = true;
    this.details.push(selectedMember);
    this.student_num=student_number;
  }

  officerClick(student_number: string) {
    const selectedMember = this.members
      .find(member => member.student_number === student_number);

    this.showModalOfficer = true;
    this.requestMemberBtn = false;
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
  this.confirmAction('Confirm Removal', 
    'Are you sure you want to remove this member?', () => {
      const data = { student_number: this.student_num };
      this.spinnerService.show('Removing member...');

      this.memberService.declineMember(data).pipe(
        catchError((error) => {
          this.spinnerService.hide();
  
          if (!navigator.onLine) {
            this.responseService.handleError
              ('You are offline. Please check your internet connection.');
          } else {
            this.responseService.handleError
              (`An error occurred while removing a member. 
                Please try again.`);
          }
  
          // Return an empty observable to complete the pipe
          return of(null);
        })
      ).subscribe((res: Response) => {
        this.response = res;
        setTimeout(() => {
          this.spinnerService.hide();
          this.responseService.handleResponse(this.response);

          this.showModalMember = false;
          this.showModalOfficer = false;
          this.details = [];
          this.student_num = '';

          this.showMembers(); // Refresh members list
          this.showOfficers(); // Refresh officers list
        }, 500);
      });
  });
}


  promoteToOfficer() {
    this.confirmAction('Confirm Promotion', 
      'Are you sure you want to promote this member to officer?', () => {
        const data = {student_number: this.student_num };
        this.spinnerService.show('Promoting member...');
        this.memberService.promoteToOfficer(data).pipe(
          catchError((error) => {
            this.spinnerService.hide();
    
            if (!navigator.onLine) {
              this.responseService.handleError
                ('You are offline. Please check your internet connection.');
            } else {
              this.responseService.handleError
                (`An error occurred while promoting a member's role. 
                  Please try again.`);
            }
    
            // Return an empty observable to complete the pipe
            return of(null);
          })
        ).subscribe((res: Response) => {
          this.response = res;
          setTimeout(() => {
            this.spinnerService.hide();
            this.responseService.handleResponse(this.response);

            this.showModalMember = false;
            this.showOfficers();
            this.details=[]; 
          }, 500);
        });
  });
}

  demoteToMember() {
    this.confirmAction('Confirm Demotion', 
      'Are you sure you want to demote this officer?', () => {
        const data = {student_number: this.student_num };
        this.spinnerService.show('Demoting to member...');

        this.memberService.demoteToMember(data).pipe(
          catchError((error) => {
            this.spinnerService.hide();
    
            if (!navigator.onLine) {
              this.responseService.handleError
                ('You are offline. Please check your internet connection.');
            } else {
              this.responseService.handleError
                (`An error occurred while demoting a member's role. 
                  Please try again.`);
            }
    
            // Return an empty observable to complete the pipe
            return of(null);
          })
        ).subscribe((res: Response) => {
          this.response = res;
          setTimeout(() => {
            this.spinnerService.hide();
            this.responseService.handleResponse(this.response);
      
            this.showModalMember = false;
            this.showModalOfficer = false;
            this.showOfficers();
            this.details=[]; 
          }, 500);
        });
    });
  }

  searchMembers() {
    this.searchMember.get('keyword')!.valueChanges.pipe(
      switchMap((keyword)=>{
        return this.memberService.searchMember(keyword).pipe(
          debounceTime(2000),
          catchError((error: HttpErrorResponse)=>{
            if (!navigator.onLine) {
              this.responseService.handleError
                ('You are offline. Please check your internet connection.');
            } else {
              this.responseService.handleError
                (`An error occurred. Please try again.`);
            }
    
            return EMPTY;
        }))
      })).subscribe((value:Member[] | Response)=>{
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
    return this.officers
      .some(officer => officer.student_number === studentNumber);
  }
}