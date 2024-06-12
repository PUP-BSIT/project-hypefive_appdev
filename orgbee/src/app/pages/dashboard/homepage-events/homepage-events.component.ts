import { Component } from '@angular/core';

@Component({
  selector: 'app-homepage-events',
  templateUrl: './homepage-events.component.html',
  styleUrls: ['./homepage-events.component.css']
})
export class HomepageEventsComponent {
  isEventModalVisible = false;

  openEventModal() {
    this.isEventModalVisible = true;
  }

  closeEventModal() {
    this.isEventModalVisible = false;
  }
}
