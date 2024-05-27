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
    this.modalSubject = announcement.subject;
    this.modalContent = announcement.content;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.modalSubject = '';
    this.modalContent = '';
  }

  toggleModalAnnouncement() {
    this.openModalAnnouncement = !this.openModalAnnouncement; // Toggle the value
  }

  closeModalAnnouncement() {
    this.openModalAnnouncement = false;
  }

  submitAnnouncement() {
    if (this.announcementForm.valid) {
      // Logging the form values to the console
      console.log('Form Values:', this.announcementForm.value);
      this.closeModalAnnouncement();

      // You can perform further actions here, such as sending the form data to a server
    } else {
      // If the form is invalid, mark all fields as touched to display validation errors
      this.announcementForm.markAllAsTouched();
    }
  }

  truncateText(text: string, limit: number): string {
    if (text.length > limit) {
      return text.substring(0, limit) + '...';
    }
    return text;
  }
}
