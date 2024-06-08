import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { LoginService, UserInfo } from '../../../../service/login.service';
import { AnnouncementService, Announcement } from '../../../../service/announcement.service';

@Component({
  selector: 'app-an-modal',
  templateUrl: './an-modal.component.html',
  styleUrls: ['../dashboard.component.css'] 
})

export class AnModalComponent implements OnInit {
  userInfo: UserInfo | null = null;
  announcements: Announcement[] = [];

  @Input() showModal = false;
  @Input() announcementForm: FormGroup;
  @Input() handleAnnouncementCreated: (newAnnouncement: Announcement) => void;

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
      recipient: ['', Validators.required],
    });

    this.loginService.onDataRetrieved((data: UserInfo) => {
      this.userInfo = data;
    });
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

  submitAnnouncement(): void {
    if (this.announcementForm.valid && this.userInfo) {
      const currentUserId = this.userInfo.user_id;
      if (currentUserId) {
        const newAnnouncement: Announcement = {
          id: 0,
          subject: this.subjectControl?.value,
          content: this.messageControl?.value,
          recipient: this.recipientControl?.value,
          student_id: currentUserId
        };
  
        this.announcementService.createAnnouncement(newAnnouncement).subscribe(
          (announcementId: number) => {
            newAnnouncement.id = announcementId;
            this.announcements.push(newAnnouncement); 
            this.announcementForm.reset();
            this.showModal = false; 
            alert('Announcement created successfully! ID: ' + announcementId);
            //TO-DO: handle announcement creation in ui
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
      this.announcementForm.markAllAsTouched();
    }
  }
  

  closeModal(): void {
    this.showModal = false;
  }
}
