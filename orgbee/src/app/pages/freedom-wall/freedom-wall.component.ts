import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PostDialogComponent } from './post-dialog/post-dialog.component';
import { DataService } from '../../../service/data.service';

export interface Post {
  subject: string;
  content: string;
  background_color: string;
  showOptions?: boolean;
}

@Component({
  selector: 'app-freedom-wall',
  templateUrl: './freedom-wall.component.html',
  styleUrls: ['./freedom-wall.component.css']
})
export class FreedomWallComponent implements OnInit {
  posts: Post[] = [];
  showModal = false;
  selectedPost: Post;
  freedomwallForm: FormGroup;

  constructor(private dialog: MatDialog, private dataService: DataService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.freedomwallForm = this.fb.group({
      newPostTitle: ['', Validators.required],
      newPostText: ['', [Validators.required]]
    });
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
  response:any;
  addPost(): void {
    if (this.freedomwallForm.invalid) {
      this.freedomwallForm.markAllAsTouched();
      return;
    }

    const newPost: Post = {
      subject: this.freedomwallForm.value.newPostTitle,
      content: this.freedomwallForm.value.newPostText,
      background_color: this.getRandomColor(),
    };
    this.dataService.addPosts(newPost).subscribe(res=>{
      this.response=res;
      console.log(this.response);
    })

    this.posts.push(newPost);
    console.log(this.posts);
    this.freedomwallForm.reset();
    this.toggleModal();
  }

  closeModal(){
    this.showModal = false;
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

  editPost(post: Post) {
    // To do: edit logic for backend
    alert('Edit Post: ' + post.content);
  }

  deletePost(post: Post) {
    const index = this.posts.indexOf(post);
    if (index > -1) {
      this.posts.splice(index, 1);
    }
  }
}
