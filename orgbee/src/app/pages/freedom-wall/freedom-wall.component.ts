import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PostDialogComponent } from './post-dialog/post-dialog.component';

export interface Post {
  text: string;
  backgroundColor: string;
}

@Component({
  selector: 'app-freedom-wall',
  templateUrl: './freedom-wall.component.html',
  styleUrl: './freedom-wall.component.css'
})
export class FreedomWallComponent {
  newPostText = '';
  posts: Post[] = [];
  showModal = false;
  selectedPost: Post;

  constructor(private dialog: MatDialog) {}

  addPost() {
    if (this.newPostText.trim()) {
      const newPost: Post = {
        text: this.newPostText,
        backgroundColor: this.getRandomColor(),
      };
      this.posts.push(newPost);
      this.newPostText = '';
      this.toggleModal();
    }
  }

  openPost(post: Post) {
    this.selectedPost = post;
    this.dialog.open(PostDialogComponent, {
      data: {
        text: post.text,
        backgroundColor: post.backgroundColor,
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

}
