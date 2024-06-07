import { Component } from '@angular/core';

@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.css']
})

export class ArchiveComponent {
  showEventModal= false;
  events = [
    { icon: '../../../assets/icon.jpg'},
    { icon: '../../../assets/logo.png'},
    { icon: '../../../assets/icon.jpg'},
    { icon: '../../../assets/icon.jpg'},
    { icon: '../../../assets/icon.jpg'},
    { icon: '../../../assets/logo.png'},
  ];

  eventLists = [
    { eventTitle: "Knights of Honor", eventDate: "03/10/2020"},
    { eventTitle: "Knights of Honor", eventDate: "03/10/2020"},
    { eventTitle: "Knights of Honor", eventDate: "03/10/2020"},
    { eventTitle: "Knights of Honor", eventDate: "03/10/2020"},
    
  ];

  details = [
    { icon: '../../../assets/icon.jpg', 
      eventTitle: "Knights of Honor",
      eventLocation: "Gym",
      eventDate: "March 10, 2020"
    }
  ];
  currentSlide = 0;

  eventClick () {
    this.showEventModal = true;
  }
  
  closeModal() {
    this.showEventModal = false;
  }

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
