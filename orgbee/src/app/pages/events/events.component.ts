import { Time } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { EventService } from '../../../service/event-service/event.service';

import { Member } from '../../../service/member-service/member.service';
import { Event } from '../../../service/event-service/event.service';
import { ModalButton } from '../../../service/event-service/event.service';

import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css'],
})

export class EventsComponent implements OnInit {
  eventForm: FormGroup;
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

  constructor(private eventService:EventService) {}

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
    this.eventService.getUpcomingEvents().subscribe((upcoming: Event[])=>{
      this.filteredEvents = upcoming;
    });
  }

  showDraftEvents() {
    //Get events with event_state = 1 and status of 1
    this.eventService.getDraftEvents().subscribe((draft: Event[])=>{
      this.filteredEvents = draft;
    });
  }

  showOccuringEvents() {
    //Get events with event_state = 2 and status of 2
    this.eventService.getOccuringEvents().subscribe((occuring: Event[])=>{
      this.filteredEvents = occuring;
    });
  }

  getRegisteredMembers() {
    this.eventService.getRegisteredMembers(this.selectedEvent.id)
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
