import { Component, ElementRef, AfterViewInit, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Post } from '../freedom-wall.component';

@Component({
  selector: 'app-post-dialog',
  templateUrl: './post-dialog.component.html',
  styleUrls: ['./post-dialog.component.css']
})
export class PostDialogComponent implements AfterViewInit {
  @Input() postSelected: Post;

  constructor(
    public dialogRef: MatDialogRef<PostDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Post,
    private elementRef: ElementRef
  ) {
    this.postSelected = data;
  }

  ngAfterViewInit() {
    const dialogContent = this.elementRef.nativeElement.querySelector('.dialog-content');
    if (dialogContent) {
      const textHeight = dialogContent.querySelector('p').scrollHeight;
      const maxHeight = window.innerHeight - 100;
      const newHeight = Math.min(textHeight + 40, maxHeight);

      dialogContent.style.height = newHeight + 'px';
    }
  }
}
