import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DatePipe } from '@angular/common';
import { AnnouncementService, Announcement } 
  from '../../../service/announcement.service';
import { LoginService, UserInfo } from '../../../service/login.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog.component';
import { LoadingService } from '../../../service/loading.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SpinnerService } from '../../../service/spinner.service';

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
  showSettings = false;
  activeTab: string = 'all';
  loggingOut: boolean = false;
  isLoading: boolean = false;
  userInfo: UserInfo = {
    email: '',
    id: 0,
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
    public dialog: MatDialog,
    private datePipe: DatePipe,
    private router:Router,
    private loadingService: LoadingService,
    private snackBar: MatSnackBar,
    private spinnerService: SpinnerService
  ) {}

  ngOnInit(): void {
      this.announcementForm = this.formBuilder.group({
        subject: ['', [Validators.required]],
        message: ['', [Validators.required]],
        recipient: ['', Validators.required],  
      });
      this.loginService.onDataRetrieved((data: UserInfo) => {
        this.userInfo = data;
      });
      this.fetchAnnouncements();const today = new Date();
  }

  //TODO: update later according to new table in database
  updateUserInfo(selectedAvatarPath: string): void {
    //this.userInfo.icon = selectedAvatarPath; 
  }
  
  confirmAction(title: string, message: string, callback: () => void) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '300px',
      data: { title: title, message: message }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        callback();
      }
    });
  }
  
  toggleProfileIconEdit(): void { 
    this.showProfileIconEdit = !this.showProfileIconEdit;
  }

  toggleSettings(): void { 
    this.showSettings = !this.showSettings;
  }

  handleProfileIconClose(): void {
    this.showProfileIconEdit = false;
  }

  handleSettingsClose(): void {
    this.showSettings = false;
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
    this.refreshAnnouncements();
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
    this.confirmAction('Confirm Delete', 'Are you sure you want to delete this announcement?', () => {
    this.spinnerService.show('Deleting announcement...');
    this.announcementService.deleteAnnouncement(announcement.id).subscribe(
      () => {
        this.announcements = 
          this.announcements.filter(a => a.id !== announcement.id);
          this.spinnerService.hide();
          this.showSnackBar('Announcement deleted successfully.', 'success');
        },
        (error) => {
          this.spinnerService.hide();
          this.showSnackBar('Error deleting announcement. Please try again later.', 'error');
        }
    );
  });
}

  filterByAll(): void {
    this.fetchAnnouncements(); 
  }

  filterByOfficers(): void {
    this.announcementService.getAnnouncements().subscribe(
      (announcements) => {
        this.announcements = announcements.filter(a => 
          a.recipient === 1
        );
      },
      (error) => {
        console.error('Error fetching announcements:', error);
      }
    );
  }

  filterByMe(): void {
    this.announcementService.getAnnouncements().subscribe(
      (announcements) => {
        this.announcements = announcements.filter(a => 
          a.student_id === this.userInfo.user_id
        );
      },
      (error) => {
        console.error('Error fetching announcements:', error);
      }
    );
  }

   setActiveTab(tab: string) {
    this.activeTab = tab;
    switch (tab) {
      case 'all':
        this.filterByAll();
        break;
      case 'officers':
        this.filterByOfficers();
        break;
      case 'me':
        this.filterByMe();
        break;
      // Add more cases for additional tabs as needed
      default:
        break;
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

  logout() {
    this.confirmAction('Confirm Logout', 'Are you sure you want to logout?', () => {
      this.loggingOut = true;
      localStorage.removeItem('token');
      this.loginService.setAuthStatus(false);
      setTimeout(() => {
        this.loggingOut = false;
        this.router.navigate(['/login']);
      }, 2000); 
    });
  }
  
  private showSnackBar(message: string, panelClass: string) {
    this.snackBar.open(message, '', {
      duration: 2000,
      panelClass: ['custom-snackbar', panelClass]
    });
  }

  refreshAnnouncements(): void {
    switch (this.activeTab) {
      case 'all':
        this.filterByAll();
        break;
      case 'officers':
        this.filterByOfficers();
        break;
      case 'me':
        this.filterByMe();
        break;
      default:
        break;
    }
  }
}
