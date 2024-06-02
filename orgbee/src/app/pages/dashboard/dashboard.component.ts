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
  selectedAnnouncement: Announcement | null = null;
  showModal: boolean = false;
  
  showOneAnnouncement: boolean = false;
  modalSubject: string = '';
  modalContent: string = '';
  openModalAnnouncement: boolean = false;
  showEditModal = false; 
  userData: any = {}; 

  announcementForm: FormGroup;

  constructor(private formBuilder: FormBuilder,   private loginService: LoginService, private announcementService: AnnouncementService ) {}
  toggleModal(): void {
    this.showModal = !this.showModal;
  }

 closeModal(): void {
    this.showModal = false;
  }


  closeOneAnnouncement(): void {
    this.showOneAnnouncement = false;
  }

  ngOnInit(): void {
    this.announcementForm = this.formBuilder.group({
      subject:  ['', [Validators.required]],
      message: ['', [Validators.required]],
      recipient: ['', Validators.required],
      
    });

    this.fetchAnnouncements();
    /*this.retrieveUserData();*/
  }
  
  /*retrieveUserData(): void {
    this.loginService.retrieveStudentData().subscribe(
      (userData) => {
        this.userData = userData;
        console.log('User Data:', this.userData);
      },
      (error) => {
        console.error('Error retrieving user data:', error);
      }
    );
  }*/

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
    this.showOneAnnouncement = true;
  }

  openEditModal(announcement: Announcement) {
    this.selectedAnnouncement = announcement; 
    console.log('Selected Announcement:', this.selectedAnnouncement); // Log the selected announcement
    this.showEditModal = true;
}

  toggleModalAnnouncement() {
    this.openModalAnnouncement = true;
    this.announcementForm.reset();
  }

  closeModalAnnouncement() {
    this.openModalAnnouncement = false;
  }

  closeModalEditAnnouncement() {
    this.showEditModal = false;
  }

  handleAnnouncementUpdated(updatedAnnouncement: Announcement): void {
    const index = this.announcements.findIndex((a) => a.id === updatedAnnouncement.id);
    if (index > -1) {
      this.announcements[index] = updatedAnnouncement;
    }
    this.closeModalEditAnnouncement();
  }
  
  handleAnnouncementCreated(newAnnouncement: Announcement): void {
    this.announcements.push(newAnnouncement);
  }
  
  deleteAnnouncement(announcement: Announcement) {
    const index = this.announcements.indexOf(announcement);
    if (index > -1) {
      const announcementId = announcement.id; 
      this.announcementService.deleteAnnouncement(announcementId).subscribe(
        () => {
          this.announcements.splice(index, 1);
          console.log('Announcement deleted successfully.');
        },
        (error) => {
          console.error('Error deleting announcement:', error);
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
