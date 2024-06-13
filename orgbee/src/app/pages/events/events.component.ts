import { Time } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../../../service/data.service';

interface Event {
  id: number;
  event_name: string; 
  location: string; 
  date: Date; 
  time: Time; 
  all_members_required: number; 
  has_reg_fee: number;  
  registration_fee?: number; 
  max_attendees: number; 
  caption?: string;
  poster_loc?: string; 
  event_status_id: number;
  event_state_id: number;
}

interface SelectedEvent {
  id: number;
  event_name: string; 
  location: string; 
  date: Date; 
  time: Time; 
  all_members_required: number; 
  has_reg_fee: number;  
  registration_fee?: number; 
  max_attendees: number; 
  caption?: string;
  poster_loc?: string; 
  event_status_id: number;
  event_state_id: number;
}

interface Member {
  name: string;
}

interface SelectedEvent extends Event {
  registeredMembers?: Member[];
}

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css'],
})
export class EventsComponent implements OnInit {
  eventForm: FormGroup;
  currentStep = 0;
  activeTab = 'UPCOMING';
  filteredEvents: Event[];
  createEventModal = false;
  editEventModal = false;
  isManageModalVisible = false;
  selectedEvent: SelectedEvent | null = null;

  showModalUpcoming = false;
  showModalOccuring = false;
  showModalDraft = false;

  response: any; //temporary
  updateEventId: number;

  
  constructor(private fb: FormBuilder,
    private dataService: DataService) {}

  ngOnInit(): void {
    this.displayEvents(this.activeTab);
    this.eventForm = this.fb.group({
      //TO DO: Add additional validators
      event_name: ['', Validators.required],
      location: ['', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required],
      all_members_required: ['', Validators.required],
      has_reg_fee: ['', Validators.required],
      registration_fee: [{ value: '', disabled: true }],
      max_attendees: ['', Validators.required],
      caption: [''],
      poster_loc: [''],
    });

    this.eventForm.get('has_reg_fee')?.valueChanges.subscribe((value) => {
      const registration_feeControl = this.eventForm.get('registration_fee');
      if (parseInt(value) === 1) {
        registration_feeControl?.enable();
      } else {
        registration_feeControl?.disable();
      }
    });
  }

  openCreateModal(): void {
    this.createEventModal = true;
  }

  closeCreateEditModal(): void {
    this.createEventModal = false;
    this.editEventModal = false;
  }
editModalTab:string;
  openManageModal(event: Event): void {
    this.selectedEvent = event;
    this.isManageModalVisible = true;
    if (this.selectedEvent.event_status_id === 2 && this.selectedEvent.event_state_id === 1 ) {
      this.showModalUpcoming = true;
      this.showModalDraft = false;
      this.showModalOccuring = false;

      this.editModalTab = 'UPCOMING';
    } else if (this.selectedEvent.event_status_id === 2 && this.selectedEvent.event_state_id ===2  ) {
      this.showModalOccuring = true;
      this.showModalUpcoming = false;
      this.showModalDraft = false;

      this.editModalTab = 'OCCURING';
    } else if(this.selectedEvent.event_status_id === 1){
      this.showModalDraft=true;
      this.showModalOccuring = false;
      this.showModalUpcoming = false;

      this.editModalTab = 'DRAFT';
    } 
  }

  closeManageModal(): void {
    this.isManageModalVisible = false;
  }

  publishDraft(event:Event) {
    const id = {id : event.id};
    this.dataService.publishDraft(id).subscribe(res =>{
      this.response=res;
      console.log(this.response);
      this.showDraftEvents();
      this.closeManageModal();
    });
  }

  markAsOccurring(event: Event): void {
    const id = {id : event.id};
    this.dataService.markAsOccuring(id).subscribe(res =>{
      this.response=res;

      this.showUpcomingEvents();
      this.closeManageModal();
    });
  }

  markAsComplete(event: Event) {
    const id = {id : event.id};
    this.dataService.markAsComplete(id).subscribe(res =>{
      this.response=res;

      this.showOccuringEvents();
      this.closeManageModal();
    });
  }

  cancelEvent(event: Event): void {
    const id = {id : event.id};
    this.dataService.cancelEvent(id).subscribe(res =>{
      this.response=res;
      if (this.editModalTab === 'UPCOMING') {
        this.showUpcomingEvents();
        this.editModalTab = "";
      } else if (this.editModalTab === 'OCCURING') {
        this.showOccuringEvents();
        this.editModalTab = "";
      } else if (this.editModalTab === 'DRAFT') {
        this.showDraftEvents();
        this.editModalTab = "";
      }
      this.closeManageModal();
    });
  }

  showUpcomingEvents() {
    //Get events with event_state = 1 with status of 2
    this.dataService.getUpcomingEvents().subscribe((upcoming: Event[])=>{
      this.filteredEvents = upcoming;
    })
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

  nextStep(): void {
    if (this.currentStep < 3) {
      this.currentStep++;
    }
  }

  prevStep(): void {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }


  submitForm(type: string): void {
    if (this.eventForm.valid) {
      const newEvent = this.eventForm.value as Event;

      if (type === 'publish') {
        newEvent.event_status_id = 2; //set the status to publish
        console.log(newEvent); //review the details
        this.dataService.createEvent(newEvent).subscribe(res=>{
          this.response=res;
          console.log(this.response);
          this.showUpcomingEvents();
        });
      } else {
        newEvent.event_status_id = 1; //set the status to draft
        console.log(newEvent); //review the details
        this.dataService.createEvent(newEvent).subscribe(res=>{
          this.response=res;
          console.log(this.response); 
          this.showDraftEvents();
        });
      }

      this.closeCreateEditModal();
      this.currentStep = 0;
      this.eventForm.reset();
      this.displayEvents(this.activeTab);
    } else { 
      alert('Please fill in all required fields.');
    }
  }


  editEvent(event: Event): void {
    this.editEventModal = true;
    this.closeManageModal();
    this.eventForm.patchValue(event); //pass the value of the selected event
    this.updateEventId = event.id;
  }

  saveEdit(type:string){
    const updateEvent = this.eventForm.value as Event;
    updateEvent.id = this.updateEventId;

    if(updateEvent){
      if(type ==='publish'){
        updateEvent.event_status_id = 2; //set the status to publish
        this.dataService.updateEvent(updateEvent).subscribe(res=>{
          this.response=res;
          console.log(this.response);
          this.showUpcomingEvents();
        });
      } else {
        updateEvent.event_status_id = 1; //set the status to draft
        this.dataService.updateEvent(updateEvent).subscribe(res=>{
          this.response=res;
          console.log(this.response);
          this.showDraftEvents();
          this.showUpcomingEvents();
        });
      }
      this.closeCreateEditModal();
      this.currentStep = 0;
      this.eventForm.reset();
    }
  }
}
