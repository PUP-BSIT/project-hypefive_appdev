import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AnnouncementService, Announcement } from '../../../service/announcement.service';
import { LoginService, UserInfo } from '../../../service/login.service';

enum Roles {
  Student = 1,
  Officer = 2,
  Admin = 3
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})

export class DashboardComponent implements OnInit {
  announcements: Announcement[] = [];
  selectedAnnouncement: Announcement | null = null;
  showModal = false;
  showOneAnnouncement = false;
  modalSubject = '';
  modalContent = '';
  openModalAnnouncement = false;
  showEditModal = false; 
  userInfo: UserInfo = {
    email: '',
    id: ''
  };

  announcementForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private announcementService: AnnouncementService
  ) {}

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
      subject: ['', [Validators.required]],
      message: ['', [Validators.required]],
      recipient: ['', Validators.required],  
    });
    this.loginService.onDataRetrieved((data: UserInfo) => {
      this.userInfo = data;
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

  openModal(announcement: Announcement): void {
    this.announcementForm.patchValue({
      subject: announcement.subject,
      message: announcement.content,
      recipient: announcement.recipient,
    });
    this.modalSubject = announcement.subject;
    this.modalContent = announcement.content;
    this.showOneAnnouncement = true;
  }

  openEditModal(announcement: Announcement): void {
    this.selectedAnnouncement = announcement; 
    console.log('Selected Announcement:', this.selectedAnnouncement); // Log the selected announcement
    this.showEditModal = true;
  }

  toggleModalAnnouncement(): void {
    this.openModalAnnouncement = true;
    this.announcementForm.reset();
  }

  closeModalAnnouncement(): void {
    this.openModalAnnouncement = false;
  }

  closeModalEditAnnouncement(): void {
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
  // Log the updated announcements array
  console.log('Updated announcements array:', this.announcements);
}


  deleteAnnouncement(announcement: Announcement): void {
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

  getRoleName(roleId: number): string {
    return Roles[roleId] || 'Unknown Role';
  }

  getHeaderClasses(): string {
    if (this.userInfo.role_id === 1) {
      return 'student';
    } else if (this.userInfo.role_id === 2) {
      return 'officer';
    } else if (this.userInfo.role_id === 3) {
      return 'admin';
    } else {
      return ''; 
    }
  }
}
