import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { AnnouncementService } from '../../../../service/announcement.service';
import { LoginService } from '../../../../service/login.service';

export interface Announcement {
  id: number;
  subject: string;
  content: string;
  recipient: string;
}

@Component({
  selector: 'app-an-edit-modal',
  templateUrl: './an-edit-modal.component.html',
  styleUrls: ['../dashboard.component.css']
})
export class AnEditModalComponent implements OnInit, OnChanges {
  @Input() selectedAnnouncement: Announcement | null = null;
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();
  @Output() announcementUpdated: EventEmitter<Announcement> = new EventEmitter<Announcement>();
  @Input() showEditModal: boolean = false;
  announcementForm: FormGroup;

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

  get subjectControl(): AbstractControl {
    return this.announcementForm.get('subject')!;
  }

  get messageControl(): AbstractControl {
    return this.announcementForm.get('message')!;
  }

  get recipientControl(): AbstractControl {
    return this.announcementForm.get('recipient')!;
  }

  close(): void {
    this.closeModal.emit();
  }

  submitEditAnnouncement(): void {
    if (this.announcementForm.valid && this.selectedAnnouncement) {
      const token = localStorage.getItem('token');
      if (token) {
        const currentUserId = this.loginService.extractUserIdFromToken(token);
        if (currentUserId) {
          const updatedAnnouncement = {
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
        console.error('JWT token not found.');
        alert('Error updating announcement. Please try again later.');
      }
    } else {
      this.announcementForm.markAllAsTouched();
    }
  }
}
