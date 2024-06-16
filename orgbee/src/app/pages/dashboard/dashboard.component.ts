import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DatePipe } from '@angular/common';
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
  modalDate = '';
  modalAuthor = '';
  modalUpdated = false;
  openModalAnnouncement = false;
  showEditModal = false; 
  showProfileIconEdit = false;  
  userInfo: UserInfo = {
    email: '',
    id: '',
    role_id: 0,
    first_name: '',
    last_name: '',
    student_number: '',
    birthday: '',
    gender: '',
    user_id: 0
  };

  announcementForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private announcementService: AnnouncementService,
    private datePipe: DatePipe
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
        if (this.userInfo.role_id === Roles.Student) {
          this.announcements = announcements.filter(a => a.recipient === 0);
        } else if (this.userInfo.role_id === Roles.Officer || 
                        this.userInfo.role_id === Roles.Admin) {
          this.announcements = 
            announcements.filter(a => a.recipient === 0 || a.recipient === 1);
        }
      },
      (error) => {
        console.error('Error fetching announcements:', error);
      }
    );
  }

  openModal(announcement: Announcement): void {
    this.modalSubject = announcement.subject;
    this.modalContent = announcement.content;
    this.modalDate = announcement.created_at || '';
    this.modalAuthor = announcement.author || '';
    this.showOneAnnouncement = true;
    this.modalUpdated = !!announcement.updated_at;
  }

  openEditModal(announcement: Announcement): void {
    this.selectedAnnouncement = announcement; 
    this.announcementForm.patchValue({
      subject: announcement.subject,
      message: announcement.content,
      recipient: announcement.recipient,
    });
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
    const index = 
      this.announcements.findIndex((a) => a.id === updatedAnnouncement.id);
    if (index > -1) {
      this.announcements[index] = {
        ...updatedAnnouncement,
        created_at: this.getCurrentDateTime(), 
        author: `${this.userInfo.first_name} ${this.userInfo.last_name}`, 
        updated_at: this.getCurrentDateTime(), 
      };
    }
    this.closeModalEditAnnouncement();
  }
  
  handleAnnouncementCreated(newAnnouncement: Announcement): void {
    const newAnnouncementDisplay: Announcement = {
      ...newAnnouncement,
      created_at: this.getCurrentDateTime(), 
      author: `${this.userInfo.first_name} ${this.userInfo.last_name}`, 
    };
    this.announcements.push(newAnnouncementDisplay);
  }
  
  getCurrentDateTime(): string {
    const now = new Date();
    return this.datePipe.transform(now, 'MMMM d, yyyy h:mm a') || '';
  }
  
  deleteAnnouncement(announcement: Announcement): void {
    this.announcementService.deleteAnnouncement(announcement.id).subscribe(
      () => {
        this.announcements = 
          this.announcements.filter(a => a.id !== announcement.id);
      },
      (error) => {
        console.error('Error deleting announcement:', error);
      }
    );
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
    switch (this.userInfo.role_id) {
      case Roles.Student:
        return 'student';
      case Roles.Officer:
        return 'officer';
      case Roles.Admin:
        return 'admin';
      default:
        return ''; 
    }
  }
}
