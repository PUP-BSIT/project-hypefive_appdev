import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  announcements = [
    {
      subject: 'Subject 1',
      content:
        'Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum',
    },
    { subject: 'Subject 2', content: 'Lorem Ipsum Lorem Ipsum' },
    { subject: 'Subject 3', content: 'Lorem Ipsum Lorem Ipsum' },
    { subject: 'Subject 4', content: 'Lorem Ipsum Lorem Ipsum' },
  ];

  showModal: boolean = false;
  modalSubject: string = '';
  modalContent: string = '';
  openModalAnnouncement: boolean = false; // Corrected property name

  announcementForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.announcementForm = this.formBuilder.group({
      subject: ['', Validators.required],
      message: ['', Validators.required],
      recipient: ['', Validators.required],
    });
  }

  openModal(announcement: any) {
this.announcementForm.patchValue({
      subject: announcement.subject,
      message: announcement.content,
      recipient: announcement.recipient, // You can set a default recipient value here
    });
    this.modalSubject = announcement.subject;
    this.modalContent = announcement.content;
    this.showModal = true;
  }

  openEditModal(announcement: Announcement) {
    this.announcementForm.patchValue({
      subject: announcement.subject,
      message: announcement.content,
      recipient: announcement.recipient, // Set default recipient if needed
    });
    this.modalSubject = announcement.subject;
    this.modalContent = announcement.content;
    this.openModalEditAnnouncement = true; // Show the edit modal
  }

  closeModal() {
    this.showModal = false;
    this.modalSubject = '';
    this.modalContent = '';
  }

  toggleModalAnnouncement() {
    this.openModalAnnouncement = true;
    this.announcementForm.reset(); // Toggle the value
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
      this.announcementForm.reset(); // Reset the form after edit
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
