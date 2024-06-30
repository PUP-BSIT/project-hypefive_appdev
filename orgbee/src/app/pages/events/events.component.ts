import { Time } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { DataService } from '../../../service/data.service';

import { Member } from '../members/members.component';

export interface Event {
  id: number;
  event_name: string; 
  location: string; 
  date: Date; 
  time: string; 
  all_members_required: number; 
  has_reg_fee: number;  
  registration_fee?: number; 
  max_attendees: number; 
  caption?: string;
  poster_loc: any; 
  event_status_id: number;
  event_state_id: number;
  reg_count:number;
}

export interface ModalButton {
  showModalUpcoming: boolean;
  showModalDraft: boolean;
  showModalOccuring: boolean;
}

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css'],
})
export class EventsComponent implements OnInit {
  eventForm: FormGroup;
  members: Member[] = [];
  createEventModal = false;
  isManageModalVisible = false;
  editEventModal = false;

  selectedEvent: Event;
  modalButton: ModalButton = {
    showModalUpcoming: false,
    showModalDraft: false,
    showModalOccuring: false
  };

  activeTab = 'UPCOMING';
  filteredEvents: Event[] = [];
  imgPath: string = 'http://127.0.0.1:8000/storage/images/event_poster/';

  cancelEventTab:string;

  updateEventId: number;

  constructor(private dataService:DataService){}

  ngOnInit(): void {
    this.displayEvents(this.activeTab);
  }

  openCreateModal(){
    this.createEventModal = true;
  }

  openManageModal(event:Event){
    this.selectedEvent = event;
    this.getRegisteredMembers();
    this.isManageModalVisible = true;
    if (this.selectedEvent.event_status_id === 2 && this.selectedEvent.event_state_id === 1 ) {
      this.modalButton.showModalUpcoming = true;
      this.modalButton.showModalDraft = false;
      this.modalButton.showModalOccuring = false;

      this.cancelEventTab = 'UPCOMING';
    } else if (this.selectedEvent.event_status_id === 2 && this.selectedEvent.event_state_id ===2  ) {
      this.modalButton.showModalOccuring = true;
      this.modalButton.showModalUpcoming = false;
      this.modalButton.showModalDraft = false;

      this.cancelEventTab = 'OCCURING';
    } else if(this.selectedEvent.event_status_id === 1){
      this.modalButton.showModalDraft=true;
      this.modalButton.showModalOccuring = false;
      this.modalButton.showModalUpcoming = false;

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
    this.dataService.getUpcomingEvents().subscribe((upcoming: Event[])=>{
      this.filteredEvents = upcoming;
    });
    console.log("upcoming");
  }

  showDraftEvents() {
    //Get events with event_state = 1 and status of 1
    this.dataService.getDraftEvents().subscribe((draft: Event[])=>{
      this.filteredEvents = draft;
    })
  }

  showOccuringEvents(){
    //Get events with event_state = 2 and status of 2
    this.dataService.getOccuringEvents().subscribe((occuring: Event[])=>{
      this.filteredEvents = occuring;
    })
  }

  getRegisteredMembers (){
    this.dataService.getRegisteredMembers(this.selectedEvent.id).subscribe((res: Member[])=>{
      this.members = res;
      console.log(this.members);
    })
  }
  showUpdate(tab:string){
    if(tab === 'upcoming'){
      this.showUpcomingEvents();
    } else if (tab === 'occuring'){
      this.showOccuringEvents();
    } else if (tab === 'draft'){
      this.showDraftEvents();
    }
  }

  handleEditEvent(){
    this.editEventModal =true;
    console.log(this.selectedEvent);
    this.closeManageModal();
  }

}
