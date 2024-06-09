import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PostDialogComponent } from './post-dialog/post-dialog.component';
import { DataService } from '../../../service/data.service';

export interface Post {
  title: string;
  text: string;
  backgroundColor: string;
  showOptions?: boolean;
}

@Component({
  selector: 'app-freedom-wall',
  templateUrl: './freedom-wall.component.html',
  styleUrl: './freedom-wall.component.css'
})

export class FreedomWallComponent implements OnInit {
  newPostTitle = '';
  newPostText = '';
  posts: Post[] = [];
  showModal = false;
  selectedPost: Post;

  constructor(private dialog: MatDialog, private dataService: DataService) {}

  ngOnInit(): void{}

  addPost() {
    if (this.newPostText.trim()) {
      const newPost: Post = {
        title: this.newPostTitle,
        text: this.newPostText,
        backgroundColor: this.getRandomColor(),
      };
      this.posts.push(newPost);
      this.newPostTitle = '';
      this.newPostText = '';
      this.toggleModal();
    }
  }

  openPost(post: Post) {
    this.selectedPost = post;
    this.dialog.open(PostDialogComponent, {
      data: {
        title: post.title,
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

  toggleOptions(post: Post) {
    post.showOptions = !post.showOptions;
  }

  editPost(post: Post) {
    // To do: edit logic for backend
    alert('Edit Post: ' + post.text);
  }

  deletePost(post: Post) {
    const index = this.posts.indexOf(post);
    if (index > -1) {
      this.posts.splice(index, 1);
    }
  }

}
