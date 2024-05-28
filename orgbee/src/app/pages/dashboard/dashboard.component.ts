import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidatorFn,
} from '@angular/forms';

export interface Announcement {
  subject: string;
  content: string;
  recipient: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  announcements: Announcement[] = [];

  showModal: boolean = false;
  modalSubject: string = '';
  modalContent: string = '';
  openModalAnnouncement: boolean = false;
  openModalEditAnnouncement = false;

  announcementForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  subjectMaxLengthValidator(maxLength: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value || '';
      return value.length > maxLength
        ? {
            maxLength: {
              requiredLength: maxLength,
              actualLength: value.length,
            },
          }
        : null;
    };
  }

  updateSubjectCharacterCount(): void {
    const subjectControl = this.announcementForm.get('subject');
    if (subjectControl && subjectControl.value.length > 50) {
      subjectControl.setValue(subjectControl.value.substring(0, 50));
    }
  }

  ngOnInit(): void {
    this.announcementForm = this.formBuilder.group({
      subject: ['', [Validators.required, this.subjectMaxLengthValidator]],
      message: ['', [Validators.required, Validators.maxLength(800)]],
      recipient: ['', Validators.required],
    });
  }

  openModal(announcement: any) {
    this.announcementForm.patchValue({
      subject: announcement.subject,
      message: announcement.content,
      recipient: announcement.recipient, 
    });
    this.modalSubject = announcement.subject;
    this.modalContent = announcement.content;
    this.showModal = true;
  }

  openEditModal(announcement: Announcement) {
    this.announcementForm.patchValue({
      subject: announcement.subject,
      message: announcement.content,
      recipient: announcement.recipient, 
    });
    this.modalSubject = announcement.subject;
    this.modalContent = announcement.content;
    this.openModalEditAnnouncement = true; 
  }

  closeModal() {
    this.showModal = false;
    this.modalSubject = '';
    this.modalContent = '';
  }

  toggleModalAnnouncement() {
    this.openModalAnnouncement = true;
    this.announcementForm.reset(); 
  }

  closeModalAnnouncement() {
    this.openModalAnnouncement = false;
  }

  closeModalEditAnnouncement() {
    this.openModalEditAnnouncement = false;
  }
  submitEditAnnouncement() {
    if (this.announcementForm.valid) {
      const updatedAnnouncement = {
        subject: this.announcementForm.get('subject')?.value,
        content: this.announcementForm.get('message')?.value,
        recipient: this.announcementForm.get('recipient')?.value,
      };

      const index = this.announcements.findIndex(
        (a) => a.subject === this.modalSubject
      );
      if (index > -1) {
        this.announcements[index] = updatedAnnouncement;
      }
      this.closeModalEditAnnouncement();
      this.announcementForm.reset(); 
    } else {
      this.announcementForm.markAllAsTouched();
    }
  }

  submitAnnouncement() {
    if (this.announcementForm.valid) {
      const newAnnouncement = {
        subject: this.announcementForm.get('subject')?.value,
        content: this.announcementForm.get('message')?.value,
        recipient: this.announcementForm.get('recipient')?.value,
      };
      this.announcements.push(newAnnouncement);
      this.announcementForm.reset();
      this.closeModalAnnouncement();
    } else {
      this.announcementForm.markAllAsTouched();
    }
  }

  deleteAnnouncement(announcement: Announcement) {
    const index = this.announcements.indexOf(announcement);
    if (index > -1) {
      this.announcements.splice(index, 1);
    }
  }

  truncateText(text: string, limit: number): string {
    if (text.length > limit) {
      return text.substring(0, limit) + '...';
    }
    return text;
  }
}
