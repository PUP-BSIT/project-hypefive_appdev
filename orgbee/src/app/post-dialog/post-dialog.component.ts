import { Component, Inject, ElementRef, AfterViewInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-post-dialog',
  templateUrl: './post-dialog.component.html',
  styleUrls: ['./post-dialog.component.css']
})
export class PostDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private elementRef: ElementRef){}
  ngAfterViewInit() {
    const dialogContent = this.elementRef.nativeElement.querySelector('.dialog-content');
    const textHeight = dialogContent.querySelector('p').scrollHeight;
    const maxHeight = window.innerHeight - 100;
    const newHeight = Math.min(textHeight + 40, maxHeight); 

    dialogContent.style.height = newHeight + 'px';
  }
}


