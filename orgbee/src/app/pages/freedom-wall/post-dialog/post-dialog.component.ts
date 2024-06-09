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
      this.adjustDialogHeight(dialogContent);
    }
  }

  adjustDialogHeight(dialogContent: HTMLElement) {
    const titleHeight = dialogContent.querySelector('h4').scrollHeight;
    const textHeight = dialogContent.querySelector('p').scrollHeight;
    const totalHeight = titleHeight + textHeight + 30; 
    const maxHeight = window.innerHeight - 100;

    dialogContent.style.height = Math.min(totalHeight, maxHeight) + 'px';

    if (totalHeight > maxHeight) {
      dialogContent.style.overflowY = 'auto';
    } else {
      dialogContent.style.overflowY = 'visible';
    }
  }
}
