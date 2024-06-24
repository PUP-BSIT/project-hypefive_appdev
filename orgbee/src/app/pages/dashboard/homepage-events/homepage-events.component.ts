import { Component } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-homepage-events',
  templateUrl: './homepage-events.component.html',
  styleUrls: ['./homepage-events.component.css'],
  animations: [
    trigger('modalAnimation', [
      state('open', style({
        opacity: 1,
        transform: 'scale(1)'
      })),
      state('closed', style({
        opacity: 0,
        transform: 'scale(0.8)'
      })),
      transition('open <=> closed', animate('200ms ease-in-out'))
    ])
  ]
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
