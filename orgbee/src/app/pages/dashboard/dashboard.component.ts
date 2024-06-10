import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AnnouncementService, Announcement, AnnouncementDisplay } from '../../../service/announcement.service';
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
  announcementDisplay: AnnouncementDisplay[]=[];
  selectedAnnouncement: Announcement | null = null;
  showModal = false;
  showOneAnnouncement = false;
  modalSubject = '';
  modalContent = '';
  modalDate='';
  modalAuthor=''
  openModalAnnouncement = false;
  showEditModal = false; 
  showProfileIconEdit = false;  
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

  //TODO: update later according to new table in database
  updateUserInfo(selectedAvatarPath: string): void {
    //this.userInfo.icon = selectedAvatarPath; 
  }
  
  toggleProfileIconEdit(): void { 
    this.showProfileIconEdit = !this.showProfileIconEdit;
  }

  handleProfileIconClose(): void {
    this.showProfileIconEdit = false;
  }

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
        if (this.userInfo.role_id === 1) {
          this.announcementDisplay = announcements.filter(a => a.recipient === 0);
        } else if (this.userInfo.role_id === 2 || this.userInfo.role_id === 3) {
          this.announcementDisplay = announcements.filter(a => a.recipient === 0 || a.recipient === 1);
        }
      },
      (error) => {
        console.error('Error fetching announcements:', error);
      }
    );
  }

  openModal(announcementDisplay: AnnouncementDisplay): void {
    this.announcementForm.patchValue({
      subject: announcementDisplay.subject,
      message: announcementDisplay.content,
      recipient: announcementDisplay.recipient,
    });
    this.modalSubject = announcementDisplay.subject;
    this.modalContent = announcementDisplay.content;
    this.modalDate=announcementDisplay.created_at;
    this.modalAuthor=announcementDisplay.author;
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
    const index = this.announcementDisplay.findIndex((a) => a.id === updatedAnnouncement.id);
    if (index > -1) {
      this.announcementDisplay[index] = {
        ...updatedAnnouncement,
        created_at: this.getCurrentDateTime(), 
        author: `${this.userInfo.first_name} ${this.userInfo.last_name}`, 
      };
    }
    this.closeModalEditAnnouncement();
  }
  

  handleAnnouncementCreated(newAnnouncement: Announcement): void {
    const newAnnouncementDisplay: AnnouncementDisplay = {
      id: newAnnouncement.id,
      subject: newAnnouncement.subject,
      content: newAnnouncement.content,
      recipient: newAnnouncement.recipient,
      student_id: newAnnouncement.student_id, 
      created_at: this.getCurrentDateTime(), 
      author: `${this.userInfo.first_name} ${this.userInfo.last_name}`, 
    };
    this.announcementDisplay.push(newAnnouncementDisplay);
    console.log('Updated announcements array:', this.announcementDisplay);
  }
  
  getCurrentDateTime(): string {
    const now = new Date();
    return now.toISOString(); 
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
