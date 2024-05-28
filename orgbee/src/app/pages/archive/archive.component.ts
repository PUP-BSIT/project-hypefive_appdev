import { Component } from '@angular/core';

@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.css']
})

export class ArchiveComponent {
  events = [
    { icon: '../../../assets/icon.jpg'},
    { icon: '../../../assets/logo.png'},
    { icon: '../../../assets/icon.jpg'},
    { icon: '../../../assets/icon.jpg'},
    { icon: '../../../assets/icon.jpg'},
    { icon: '../../../assets/logo.png'},
  ];
  currentSlide = 0;

  moveLeft() {
    if (this.currentSlide > 0) {
      this.currentSlide -= 3;
    }
  }

  moveRight() {
    const maxSlides = Math.ceil(this.events.length / 3) - 1;
    if (this.currentSlide < maxSlides * 3) {
      this.currentSlide += 3;
    }
  }
}
