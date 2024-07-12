import { Component, OnInit } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import { EventService } from '../../../service/event-service/event.service';
import { Member } from '../../../service/member-service/member.service';
import { Event } from '../../../service/event-service/event.service';
import { ModalButton } from '../../../service/event-service/event.service';
import { ResponseService } 
  from '../../../service/response-service/response.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css'],
})

export class EventsComponent implements OnInit {
  members: Member[] = [];
  filteredEvents: Event[] = [];
  selectedEvent: Event;
  cancelEventTab:string;

  activeTab = 'UPCOMING';

  createEventModal = false;
  isManageModalVisible = false;
  editEventModal = false;

  modalButton: ModalButton = {
    upcomingModalButton: false,
    draftModalButton: false,
    occuringModalButton: false
  };

  constructor(private eventService:EventService,
    private responseService: ResponseService) {}

  ngOnInit(): void {
    this.displayEvents(this.activeTab);
  }

  openCreateModal() {
    this.createEventModal = true;
  }

  openManageModal(event:Event) {
    this.selectedEvent = event;
    this.getRegisteredMembers();
    this.isManageModalVisible = true;
    if (this.selectedEvent.event_status_id === 2 && 
      this.selectedEvent.event_state_id === 1 ) {
        this.modalButton.upcomingModalButton = true;
        this.modalButton.draftModalButton = false;
        this.modalButton.occuringModalButton = false;

        this.cancelEventTab = 'UPCOMING';
    } else if (this.selectedEvent.event_status_id === 2 && 
        this.selectedEvent.event_state_id ===2  ) {
          this.modalButton.occuringModalButton = true;
          this.modalButton.upcomingModalButton = false;
          this.modalButton.draftModalButton = false;

          this.cancelEventTab = 'OCCURING';
    } else if(this.selectedEvent.event_status_id === 1){
        this.modalButton.draftModalButton=true;
        this.modalButton.occuringModalButton = false;
        this.modalButton.upcomingModalButton = false;

        this.cancelEventTab = 'DRAFT';
    }
  }

  closeCreateModal() {
    this.createEventModal = false;
    this.editEventModal = false;
  }

  closeManageModal() {
    this.isManageModalVisible = false;
  }

  displayEvents(tab: string) {
    this.activeTab = tab;
    if (tab === 'UPCOMING') {
      this.showUpcomingEvents();
    } else if (tab === 'DRAFTS') {
      this.showDraftEvents();
    } else if (tab === 'OCCURING') {
      this.showOccuringEvents();
    }
  }

  showUpcomingEvents() {
    //Get events with event_state = 1 with status of 2
    this.eventService.getUpcomingEvents().pipe(
      catchError((error) => {
        if (!navigator.onLine) {
          this.responseService.handleError
            ('You are offline. Please check your internet connection.');
        } else {
          this.responseService.handleError
            (`An error occurred while fetching events. 
              Please try again.`);
        }

        // Return an empty observable to complete the pipe
        return of(null);
      })
    ).subscribe((upcoming: Event[])=>{
      this.filteredEvents = upcoming;
    });
  }

  showDraftEvents() {
    //Get events with event_state = 1 and status of 1
    this.eventService.getDraftEvents().pipe(
      catchError((error) => {
        if (!navigator.onLine) {
          this.responseService.handleError
            ('You are offline. Please check your internet connection.');
        } else {
          this.responseService.handleError
            (`An error occurred while fetching events. 
              Please try again.`);
        }

        // Return an empty observable to complete the pipe
        return of(null);
      })
    ).subscribe((draft: Event[])=>{
      this.filteredEvents = draft;
    });
  }

  showOccuringEvents() {
    //Get events with event_state = 2 and status of 2
    this.eventService.getOccuringEvents().pipe(
      catchError((error) => {
        if (!navigator.onLine) {
          this.responseService.handleError
            ('You are offline. Please check your internet connection.');
        } else {
          this.responseService.handleError
            (`An error occurred while fetching events. 
              Please try again.`);
        }

        // Return an empty observable to complete the pipe
        return of(null);
      })
    ).subscribe((occuring: Event[])=>{
      this.filteredEvents = occuring;
    });
  }

  getRegisteredMembers() {
    this.eventService.getRegisteredMembers(this.selectedEvent.id).pipe(
      catchError((error) => {
        if (!navigator.onLine) {
          this.responseService.handleError
            ('You are offline. Please check your internet connection.');
        } else {
          this.responseService.handleError
            (`An error occurred while fetching registered members. 
              Please try again.`);
        }

        // Return an empty observable to complete the pipe
        return of(null);
      })
    )
      .subscribe((res: Member[])=>{
      this.members = res;
    });
  }

  showUpdate(tab:string) {
    if(tab === 'upcoming') {
      this.showUpcomingEvents();
    } else if (tab === 'occuring') {
      this.showOccuringEvents();
    } else if (tab === 'draft') {
      this.showDraftEvents();
    }
  }

  handleEditEvent() {
    this.editEventModal =true;
    this.closeManageModal();
  }

}
