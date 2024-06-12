import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './homepage-events.component.html',
  styleUrls: ['./homepage-events.component.css']
})
export class DashboardComponent {
  isEventModalVisible = false;

  openEventModal() {
    this.isEventModalVisible = true;
  }

  closeEventModal() {
    this.isEventModalVisible = false;
  }
}
