import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PostDialogComponent } from '../../post-dialog/post-dialog.component';
@Component({
  selector: 'app-freedom-wall',
  templateUrl: './freedom-wall.component.html',
  styleUrl: './freedom-wall.component.css'
})
export class FreedomWallComponent {
  posts: any[] = [];
  newPostText: string = '';
  showPostCreation: boolean = false;
  showModal: boolean = false;

  constructor(private dialog: MatDialog) {}

  addPost() {
    if (this.newPostText.trim()) {
      const newPost = {
        text: this.newPostText,
        color: this.getRandomColor()
      };
      this.posts.push(newPost);
      this.newPostText = '';
      this.toggleModal();
    }
  }

  openPost(post: any) {
    this.dialog.open(PostDialogComponent, {
      data: {
        post: post,
        backgroundColor: post.color,
        expanded: post.expanded
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
