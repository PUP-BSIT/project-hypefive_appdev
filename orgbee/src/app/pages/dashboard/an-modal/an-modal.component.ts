import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidatorFn,
} from '@angular/forms';
import { LoginService } from '../../../../service/login.service';
import { AnnouncementService } from '../../../../service/announcement.service';

export interface Announcement {
  id: number; 
  subject: string;
  content: string;
  recipient: string;
}

@Component({
  selector: 'app-an-modal',
  templateUrl: './an-modal.component.html',
  styleUrls: ['../dashboard.component.css'] 
})

export class AnModalComponent implements OnInit {
  announcements: Announcement[] = [];
  userInfo: any = {};

  @Input() showModal: boolean = false;
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();
  @Output() announcementCreated: EventEmitter<Announcement> = new EventEmitter<Announcement>();
  @Input() announcementForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private announcementService: AnnouncementService
  ) {}

  updateSubjectCharacterCount(): void {
    const subjectControl = this.announcementForm.get('subject');
    if (subjectControl && subjectControl.value.length > 30) {
      subjectControl.setValue(subjectControl.value.substring(0, 30));
    }
  }

  updateMessageCharacterCount(): void {
    const messageControl = this.announcementForm.get('message');
    if (messageControl && messageControl.value.length > 850) {
      messageControl.setValue(messageControl.value.substring(0, 850));
    }
  }

  close(): void {
    this.closeModal.emit();
  }

  ngOnInit(): void {
    this.announcementForm = this.formBuilder.group({
      subject: ['', [Validators.required]],
      message: ['', [Validators.required]],
      recipient: ['', Validators.required],
    });

    this.loginService.onDataRetrieved((data: any) => {
      this.userInfo = data;
    });
  }

  get subjectControl(): AbstractControl {
    return this.announcementForm.get('subject')!;
  }

  get messageControl(): AbstractControl {
    return this.announcementForm.get('message')!;
  }

  get recipientControl(): AbstractControl {
    return this.announcementForm.get('recipient')!;
  }

  submitAnnouncement(): void {
    if (this.announcementForm.valid) {
      const token = localStorage.getItem('token');
      if (token) {
        const currentUserId = this.userInfo.user_id;
        if (currentUserId) {
          const newAnnouncement = {
            subject: this.announcementForm.get('subject')?.value,
            content: this.announcementForm.get('message')?.value,
            recipient: this.announcementForm.get('recipient')?.value,
            student_id: currentUserId,
            id: 0
          };

          this.announcementService.createAnnouncement(newAnnouncement).subscribe(
           (announcementId: number) => { 
            newAnnouncement.id = announcementId;
              this.announcementForm.reset();
              this.close();
              this.announcementCreated.emit(newAnnouncement);
              
              alert('Announcement created successfully! ID: ' + announcementId);
            },
            (error) => {
              console.error('Error creating announcement:', error);
              alert('Error creating announcement. Please try again later.');
            }
          );
        } else {
          console.error('Error extracting user ID from token.');
          alert('Error creating announcement. Please try again later.');
        }
      } else {
        console.error('JWT token not found.');
        alert('Error creating announcement. Please try again later.');
      }
    } else {
      this.announcementForm.markAllAsTouched();
    }
  }
}
