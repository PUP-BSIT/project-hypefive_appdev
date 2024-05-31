import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidatorFn,
} from '@angular/forms';
import { AnnouncementService } from '../../../service/announcement.service';
import { LoginService } from '../../../service/login.service';

export interface Announcement {
  id: number; 
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
  currentAnnouncement: Announcement | null = null;

  showModal: boolean = false;
  modalSubject: string = '';
  modalContent: string = '';
  openModalAnnouncement: boolean = false;
  openModalEditAnnouncement = false;

  announcementForm: FormGroup;

  constructor(private formBuilder: FormBuilder,   private loginService: LoginService, private announcementService: AnnouncementService ) {}

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
      subject:  ['', [Validators.required]],
      message: ['', [Validators.required]],
      recipient: ['', Validators.required],
      
      
    });

    this.fetchAnnouncements();
  }

  fetchAnnouncements(): void {
    this.announcementService.getAnnouncements().subscribe(
      (announcements) => {
        this.announcements = announcements;
      },
      (error) => {
        console.error('Error fetching announcements:', error);
      }
    );
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
    this.currentAnnouncement = announcement; 
    this.announcementForm.patchValue({
      subject: announcement.subject,
      message: announcement.content,
      recipient: announcement.recipient.toString(),
    });

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
    if (this.announcementForm.valid && this.currentAnnouncement) {
      const token = localStorage.getItem('token');
      if (token) {
        const currentUserId = this.loginService.extractUserIdFromToken(token);
        if (currentUserId) {
          const updatedAnnouncement={
            id: this.currentAnnouncement.id, // Include the id property
            subject: this.announcementForm.get('subject')?.value,
            content: this.announcementForm.get('message')?.value,
            recipient: this.announcementForm.get('recipient')?.value,
            student_id: currentUserId, // Include the student_id property
          };
      
          this.announcementService.updateAnnouncement(this.currentAnnouncement.id, updatedAnnouncement).subscribe(
            (updatedAnnouncementResponse: Announcement) => {
              const index = this.announcements.findIndex(
                (a) => a.id === this.currentAnnouncement.id
              );
              if (index > -1) {
                this.announcements[index] = updatedAnnouncementResponse;
              }
              this.closeModalEditAnnouncement();
              this.announcementForm.reset();
              console.log('Announcement updated successfully.');
            },
            (error) => {
              console.error('Error updating announcement:', error);
              // Handle error as needed
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
  
  
  submitAnnouncement() {
    if (this.announcementForm.valid) {
      const token = localStorage.getItem('token');
      if (token) {
        const currentUserId = this.loginService.extractUserIdFromToken(token);
        if (currentUserId) {
          const newAnnouncement = {
            subject: this.announcementForm.get('subject')?.value,
            content: this.announcementForm.get('message')?.value,
            recipient: this.announcementForm.get('recipient')?.value,
            student_id: currentUserId,
            id: 0
          };
  
          this.announcementService.createAnnouncement(newAnnouncement).subscribe(
            (announcementId: number) => { // Updated subscription to receive announcement ID
              this.fetchAnnouncements(); // Refresh the announcements list (optional)
              this.announcementForm.reset();
              this.closeModalAnnouncement();
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
  
  
  deleteAnnouncement(announcement: Announcement) {
    const index = this.announcements.indexOf(announcement);
    if (index > -1) {
      const announcementId = announcement.id; // Assuming 'id' is the property representing the ID of the announcement
      this.announcementService.deleteAnnouncement(announcementId).subscribe(
        () => {
          this.announcements.splice(index, 1);
          console.log('Announcement deleted successfully.');
        },
        (error) => {
          console.error('Error deleting announcement:', error);
          // Handle error as needed
        }
      );
    }
  }
  
  
  
  

  truncateText(text: string, limit: number): string {
    if (text.length > limit) {
      return text.substring(0, limit) + '...';
    }
    return text;
  }
}
