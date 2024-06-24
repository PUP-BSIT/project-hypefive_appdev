import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PostDialogComponent } from './post-dialog/post-dialog.component';
import { DataService } from '../../../service/data.service';
import { ToastrService } from 'ngx-toastr';

import { Response } from '../../app.component';

export interface Post {
  subject: string;
  content: string;
  background_color: string;
  showOptions?: boolean;
  id?: number; // for sample only
  accessibility:number; //Update to status
}

@Component({
  selector: 'app-freedom-wall',
  templateUrl: './freedom-wall.component.html',
  styleUrls: ['./freedom-wall.component.css']
})

export class FreedomWallComponent implements OnInit {
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

  constructor(
    private dialog: MatDialog, 
    private dataService: DataService, 
    private toastr: ToastrService,
    private fb: FormBuilder) { }
    
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
    this.loadPendingPosts();
    this.updatePaginatedPosts();
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
    if (this.freedomwallForm.invalid) {
      this.freedomwallForm.markAllAsTouched();
      return;
    }

    const newPost: Post = {
      subject: this.freedomwallForm.value.newPostTitle,
      content: this.freedomwallForm.value.newPostText,
      background_color: this.getRandomColor(),
      accessibility: 0, //Update to status
    };
    
    this.dataService.addPosts(newPost).subscribe((res: Response) => {
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
      this.showPosts();
      this.loadPendingPosts();
    })

    this.freedomwallForm.reset();
    this.toggleModal();
  }

  showPosts() {
    this.dataService.getPosts().subscribe((posts: Post[]) => {
      this.posts = posts;
    });
  }

  closeModal() {
    this.showModal = false;
    this.freedomwallForm.reset();
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
    const post_id = { id: id };
    this.dataService.deletePosts(post_id).subscribe((res: Response) => {
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
      this.showPosts();
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

  approvePost(postId: number) {
    const post_id = { id: postId };
    this.dataService.acceptPost(post_id).subscribe((res: Response)=>{
      this.response =res;
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
      console.log(this.response);
      this.closeManageWallModal();
      this.showPosts();
      this.loadPendingPosts();
    });
  }

  declinePost(postId: number) {
    const post_id = { id: postId };
    this.dataService.declinePost(post_id).subscribe((res: Response)=>{
      this.response =res;
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
      this.closeManageWallModal();
      this.showPosts();
      this.loadPendingPosts();
    });
  }
}
