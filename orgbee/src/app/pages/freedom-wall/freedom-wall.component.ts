import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PostDialogComponent } from './post-dialog/post-dialog.component';
import { DataService } from '../../../service/data.service';
import { ToastrService } from 'ngx-toastr';
import { Response } from '../../app.component';
import { LoginService, UserInfo } from '../../../service/login.service';
import { ConfirmationDialogService } from '../../../service/confirmation-dialog.service';
import { SpinnerService } from '../../../service/spinner.service';
import {NgxMasonryComponent}  from "ngx-masonry";

export interface Post {
  subject: string;
  content: string;
  background_color: string;
  showOptions?: boolean;
  id?: number; // for sample only
  post_status_id: number; //Update to status
  student_id: number;
  deletion_req_count?: number;
}


@Component({
  selector: 'app-freedom-wall',
  templateUrl: './freedom-wall.component.html',
  styleUrls: ['./freedom-wall.component.css']
})

export class FreedomWallComponent implements OnInit {
  @ViewChild(NgxMasonryComponent) masonry: NgxMasonryComponent;
  posts: Post[];
  showModal = false;
  selectedPost: Post;
  freedomwallForm: FormGroup;
  response: Response;
  adminApproval = true; 
  pendingPosts: Post[] = []; 
  paginatedPosts: Post[] = []; 
  currentPage = 0; 
  postsPerPage = 4; 
  totalPages = 1; 
  showManageWallModal = false; 
  deletePostCount = 0;
  manageWallCount = 0;
  showFilterMessage: boolean = false;
  showSpinner = false;
  userInfo: UserInfo;
  requestDelete:Post[];
  constructor(
    private dialog: MatDialog, 
    private dataService: DataService, 
    private toastr: ToastrService,
    private fb: FormBuilder, 
    private loginService: LoginService,
    private confirmationDialogService: ConfirmationDialogService,
    private spinnerService: SpinnerService) { }
    
  ngOnInit(): void {
    this.showPosts();
    this.freedomwallForm = this.fb.group({
      newPostTitle: ['', {
        validators: [Validators.required]
      }],
      newPostText: ['', {
        validators: [Validators.required]
      }]
    });
    this.loginService.onDataRetrieved((data: UserInfo) => {
      this.userInfo = data;
    });
    this.loadPendingPosts();
    this.updatePaginatedPosts();
    this.getDeletionRequests();
    
  }
  reloadMasonryLayout() {
    if (this.masonry) {
      this.masonry.reloadItems(); 
      this.masonry.layout(); 
      
    }
  }
  
  isCurrentUserPost(post: Post): boolean {
    console.log('Post:', post);
    console.log('Current User ID:', this.userInfo.id);
    return post.student_id === this.userInfo.id;
  }
  
  
  updateTitleCharacterCount(): void {
    const subjectControl = this.freedomwallForm.get('newPostTitle');
    if (subjectControl && subjectControl.value.length > 30) {
      subjectControl.setValue(subjectControl.value.substring(0, 30));
    }
  }

  updateTextCharacterCount(): void {
    const messageControl = this.freedomwallForm.get('newPostText');
    if (messageControl && messageControl.value.length > 500) {
      messageControl.setValue(messageControl.value.substring(0, 500));
    }
  }

  get newPostTitleControl(): AbstractControl {
    return this.freedomwallForm.get('newPostTitle')!;
  }

  get newPostTextControl(): AbstractControl {
    return this.freedomwallForm.get('newPostText')!;
  }

  addPost() {
    this.confirmationDialogService.confirmAction('Post Confirmation', 'Your post will be reviewed first by the officers. Are you sure you want to post this?', () => {
    this.spinnerService.show('Submitting post...')
      if (this.freedomwallForm.invalid) {
      this.freedomwallForm.markAllAsTouched();
      return;
    }

    const newPost: Post = {
      subject: this.freedomwallForm.value.newPostTitle,
      content: this.freedomwallForm.value.newPostText,
      background_color: this.getRandomColor(),
      post_status_id: 1, //Update to status
      student_id:  Number(this.userInfo.id),
    };
    
    this.dataService.addPosts(newPost).subscribe((res: Response) => {
      this.response = res;
            setTimeout(() => {
        this.spinnerService.hide();
      if (this.response.code === 200) {
        this.toastr.success(JSON.stringify(this.response.message), '', {
          timeOut: 2000,
          progressBar: true,
          toastClass: 'custom-toast success'
        });
      } else {
        this.toastr.error(JSON.stringify(this.response.message), '', {
          timeOut: 2000,
          progressBar: true,
          toastClass: 'custom-toast error'
        });
      }
      if (this.showFilterMessage) {
        this.filterPostsByUser();
      } else {
        this.showPosts();
      }
      this.loadPendingPosts();
    }, 500);
  });

  this.freedomwallForm.reset();
  this.toggleModal();
});
}

  showPosts() {
    this.dataService.getPosts().subscribe((posts: Post[]) => {
      this.posts = posts;
    });
  }

  closeModal() {
    this.showModal = false;
    this.freedomwallForm.reset();
    this.showRequestToDeleteModal = false;
  }

  openPost(post: Post) {
    this.selectedPost = post;
    this.dialog.open(PostDialogComponent, {
      data: {
        subject: post.subject,
        content: post.content,
        background_color: post.background_color,
      }
    });
  }

  getBackgroundColorClass(post: Post): string[] {
    const colorClass = `background-color-class-${this.getColorIndex(post.background_color)}`;
    return [colorClass];
  }
  
  getColorIndex(color: string): number {
    const colors = ['#FAA49E', '#E5B769', '#BBA0CA', '#90E0EF', '#C2FDB2'];
    return colors.indexOf(color) + 1;
  }  
  
  getRandomColor(): string {
    const colors = ['#FAA49E', '#E5B769', '#BBA0CA', '#90E0EF', '#C2FDB2'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  toggleModal() {
    this.showModal = !this.showModal;
  }

  toggleOptions(post: Post) {
    post.showOptions = !post.showOptions;
  }

  deletePost(id: number) {
    this.confirmationDialogService.confirmAction('Delete Confirmation', 'This action can\'t be undone. Are you sure you want to delete this post?', () => {
      this.spinnerService.show('Deleting post...');
      const post_id = { id: id };
      this.dataService.deletePosts(post_id).subscribe((res: Response) => {
        this.response = res;
        setTimeout(() => {
          this.spinnerService.hide();
          if (this.response.code === 200) {
            this.toastr.success(JSON.stringify(this.response.message), '', {
              timeOut: 2000,
              progressBar: true,
              toastClass: 'custom-toast success'
            });
          } else {
            this.toastr.error(JSON.stringify(this.response.message), '', {
              timeOut: 2000,
              progressBar: true,
              toastClass: 'custom-toast error'
            });
          }
          
          // Update posts based on filter status
          if (this.showFilterMessage) {
            this.posts = this.posts.filter(post => post.id !== id);
            this.reloadMasonryLayout();
          } else {
            this.showPosts();
          }
          this.getDeletionRequests();
        }, 500);
      });
    });
  }

  openManageWallModal() {
    this.showManageWallModal = true;
  }

  closeManageWallModal() {
    this.showManageWallModal = false;
  }

  loadPendingPosts() {
    this.dataService.getPostRequest().subscribe((posts: Post[]) => {
      this.pendingPosts = posts;
      this.totalPages = Math.ceil(this.pendingPosts.length / this.postsPerPage);
      this.currentPage = 1;
      this.updatePaginatedPosts();
      this.updateButtonCounts();
    });
  }

  updatePaginatedPosts() {
    const startIndex = (this.currentPage - 1) * this.postsPerPage;
    const endIndex = startIndex + this.postsPerPage;
    this.paginatedPosts = this.pendingPosts.slice(startIndex, endIndex);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedPosts();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedPosts();
    }
  }

  approvePost(postId: number): void {
    this.confirmationDialogService.confirmAction('Approve Confirmation', 'This action can\'t be undone. Are you sure you want to approve this post?', () => {
      const post_id = { id: postId };
      this.spinnerService.show('Approving post...');
      this.dataService.acceptPost(post_id).subscribe(
        (res: Response) => {
          this.response = res;
          setTimeout(() => {
            this.spinnerService.hide();
            if (this.response.code === 200) {
              this.toastr.success(JSON.stringify(this.response.message), '', {
                timeOut: 2000,
                progressBar: true,
                toastClass: 'custom-toast success'
              });
              // Refresh posts based on current view
              if (this.showFilterMessage) {
                this.showPosts();
                this.filterPostsByUser();
              } else {
                this.showPosts();
              }
              this.loadPendingPosts(); // Refresh pending posts
            } else {
              this.toastr.error(JSON.stringify(this.response.message), '', {
                timeOut: 2000,
                progressBar: true,
                toastClass: 'custom-toast error'
              });
            }
          }, 500);
        },
        (error) => {
          this.toastr.error('An error occurred while approving the post.', '', {
            timeOut: 2000,
            progressBar: true,
            toastClass: 'custom-toast error'
          });
          console.error('Error approving post:', error);
          this.spinnerService.hide();
        }
      );
    });
  }
  
  declinePost(postId: number) {
    this.confirmationDialogService.confirmAction('Decline Confirmation', 'This action cant be undone. Are you sure you want to decline this post?', () => {
      const post_id = { id: postId };
      this.dataService.declinePost(post_id).subscribe((res: Response) => {
        this.response = res;
        setTimeout(() => {
          if (this.response.code === 200) {
            this.toastr.success(JSON.stringify(this.response.message), '', {
              timeOut: 2000,
              progressBar: true,
              toastClass: 'custom-toast success'
            });
          } else {
            this.toastr.error(JSON.stringify(this.response.message), '', {
              timeOut: 2000,
              progressBar: true,
              toastClass: 'custom-toast error'
            });
          }
  
          if (this.showFilterMessage) {
            this.filterPostsByUser();
          } else {
            this.showPosts();
          }
          this.loadPendingPosts();
        }, 500);
      });
    });
  }

  showRequestToDeleteModal=false;
  openRequestToDeleteModal(){
    this.showRequestToDeleteModal=true;
  }

  getDeletionRequests(){
    this.dataService.getDeletionRequests().subscribe((posts:Post[])=>{
      this.requestDelete =posts;
      this.updateButtonCounts();
    });
  }

  requestPostToDelete(post: Post){
    this.confirmationDialogService.confirmAction('Request Confirmation', 'This action cant be undone. Are you sure you want to request to delete this post?', () => {
    const post_id = { id: post.id };
    this.dataService.deletionRequest(post_id).subscribe((res: Response)=>{
      this.response = res;
      if (this.response.code === 200) {
        this.toastr.success(JSON.stringify(this.response.message), '', {
          timeOut: 2000,
          progressBar: true,
          toastClass: 'custom-toast success'
        });
      } else {
        this.toastr.error(JSON.stringify(this.response.message), '', {
          timeOut: 2000,
          progressBar: true,
          toastClass: 'custom-toast error'
        });
      }
      this.toggleOptions(post);
      this.getDeletionRequests();
    });
  });
}

  declineRequestToDelete(id: number){
    const post_id = { id: id };
    this.dataService.declineDeletionRequest(post_id).subscribe((res:Response)=>{
      this.response = res;
      if (this.response.code === 200) {
        this.toastr.success(JSON.stringify(this.response.message), '', {
          timeOut: 2000,
          progressBar: true,
          toastClass: 'custom-toast success'
        });
      } else {
        this.toastr.error(JSON.stringify(this.response.message), '', {
          timeOut: 2000,
          progressBar: true,
          toastClass: 'custom-toast error'
        });
      }
      this.getDeletionRequests();
    })
  }

  updateButtonCounts(): void {
    this.deletePostCount = this.requestDelete ? this.requestDelete.length : 0;
    this.manageWallCount = this.pendingPosts ? this.pendingPosts.length : 0;
  }

  onDropdownClick(event: MouseEvent) {
    event.stopPropagation();
  }

  filterPostsByUser(): Post[] {
    this.showFilterMessage = true;
    this.showSpinner = true; 
    this.reloadMasonryLayout(); 
    setTimeout(() => {
      this.showSpinner = false;

    }, 1000); 
    return this.posts.filter(post => post.student_id === this.userInfo.id);
    
  }

  clearFilter(): void {
    this.showFilterMessage = false;
    this.showSpinner = true; 
    this.showPosts(); 
  
    setTimeout(() => {
      this.reloadMasonryLayout(); 
      this.showSpinner = false;
    }, 1000); 
  }
}