//TO-DO: Do not use event emitter, revise code

import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { AnnouncementService, Announcement } from '../../../../service/announcement.service';
import { LoginService, UserInfo } from '../../../../service/login.service';

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
  userInfo: UserInfo | null = null;

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

        this.announcementService.updateAnnouncement(this.selectedAnnouncement.id, updatedAnnouncement).subscribe(
          (updatedAnnouncementResponse: Announcement) => {
            this.announcementUpdated.emit(updatedAnnouncementResponse);
            this.closeModal.emit();
            this.announcementForm.reset();
            console.log('Announcement updated successfully.');
          },
          (error) => {
            console.error('Error updating announcement:', error);
          }
        );
      } else {
        console.error('Error extracting user ID from token.');
        alert('Error updating announcement. Please try again later.');
      }
    } else {
      this.announcementForm.markAllAsTouched();
    }
  }
}
