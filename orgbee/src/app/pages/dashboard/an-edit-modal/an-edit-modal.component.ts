//TO-DO: Do not use event emitter, revise code

import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { AnnouncementService, Announcement } from '../../../../service/announcement-service/announcement.service';

import { LoginService, UserInfo } from '../../../../service/login-service/login.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SpinnerService } from '../../../../service/spinner-service/spinner.service';

import { ResponseService } from '../../../../service/response-service/response.service'; // Import ResponseService

@Component({
  selector: 'app-an-edit-modal',
  templateUrl: './an-edit-modal.component.html',
  styleUrls: ['../dashboard.component.css']
})
export class AnEditModalComponent implements OnInit, OnChanges {
  @Input() selectedAnnouncement: Announcement | null = null;
  @Input() showEditModal = false;
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();
  @Output() announcementUpdated: EventEmitter<Announcement> = new EventEmitter<Announcement>();
  announcementForm: FormGroup;
  userInfo: UserInfo;

  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private announcementService: AnnouncementService,
    private responseService: ResponseService,
    private spinnerService: SpinnerService
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

  ngOnInit(): void {
    this.announcementForm = this.formBuilder.group({
      subject: ['', [Validators.required]],
      message: ['', [Validators.required]],
      recipient: ['', Validators.required]
    });

    this.loginService.onDataRetrieved((data: UserInfo) => {
      this.userInfo = data;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selectedAnnouncement && this.selectedAnnouncement) {
      console.log('Received Announcement:', this.selectedAnnouncement);
      this.announcementForm.patchValue({
        subject: this.selectedAnnouncement.subject,
        message: this.selectedAnnouncement.content,
        recipient: this.selectedAnnouncement.recipient.toString(),
      });
    }
  }

  get subjectControl(): AbstractControl | null {
    return this.announcementForm.get('subject');
  }

  get messageControl(): AbstractControl | null {
    return this.announcementForm.get('message');
  }

  get recipientControl(): AbstractControl | null {
    return this.announcementForm.get('recipient');
  }

  close(): void {
    this.closeModal.emit();
  }

  submitEditAnnouncement(): void {
    if (this.announcementForm.valid && this.selectedAnnouncement && this.userInfo) {
      const currentUserId = this.userInfo.user_id;
      if (currentUserId) {
        const updatedAnnouncement: Announcement = {
          id: this.selectedAnnouncement.id,
          subject: this.announcementForm.get('subject')?.value,
          content: this.announcementForm.get('message')?.value,
          recipient: this.announcementForm.get('recipient')?.value,
          student_id: currentUserId
        };
        this.spinnerService.show('Updating announcement...')
        this.announcementService.updateAnnouncement(this.selectedAnnouncement.id, updatedAnnouncement).subscribe({
          next: (updatedAnnouncementResponse: Announcement) => {
            this.announcementUpdated.emit(updatedAnnouncementResponse);
            this.closeModal.emit();
            this.announcementForm.reset();
            this.spinnerService.hide();
            this.responseService.handleSuccess('Announcement updated successfully.');
            },
            error: (error) => {
              if (!navigator.onLine) {
                this.responseService.handleError
                  ('You are offline. Please check your internet connection.');
              } else {
                this.responseService.handleError
                  (`An error occurred while fetching announcements. 
                    Please try again.`);
              }
            }
      });
        } else {
          this.spinnerService.hide();
          this.responseService.handleSuccess('Error creating announcement. Please try again later.');
        }
      } else {
        this.announcementForm.markAllAsTouched();
      }
    }

}
