import { Time } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../../../service/data.service';

interface Event {
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
}

interface SelectedEvent {
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
  events: Event[] = [];
  drafts: Event[] = [];
  occurringEvents: Event[] = [];
  filteredEvents: Event[] = [];
  isModalVisible = false;
  isManageModalVisible = false;
  selectedEvent: SelectedEvent | null = null;
  isEditMode = false;
  editingEventIndex = -1;

  constructor(private fb: FormBuilder,
    private dataService: DataService) {}

  ngOnInit(): void {
    this.displayEvents(this.activeTab);
    this.eventForm = this.fb.group({
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

  openModal(): void {
    this.isModalVisible = true;
  }

  closeModal(): void {
    this.isModalVisible = false;
    this.isEditMode = false;
    this.editingEventIndex = -1;
  }

  openManageModal(event: Event): void {
    this.selectedEvent = event;
    this.isManageModalVisible = true;
  }

  closeManageModal(): void {
    this.isManageModalVisible = false;
  }

  editEvent(event: Event): void {
    this.closeManageModal();
    this.openModal();
    this.eventForm.patchValue(event);
    this.isEditMode = true;
    this.editingEventIndex = this.filteredEvents.indexOf(event);
  }

  markAsOccurring(event: Event): void {
    if (this.activeTab === 'UPCOMING') {
      const index = this.events.indexOf(event);
      if (index > -1) {
        this.events.splice(index, 1);
        this.occurringEvents.push(event);
      }
    } else if (this.activeTab === 'DRAFTS') {
      const index = this.drafts.indexOf(event);
      if (index > -1) {
        this.drafts.splice(index, 1);
        this.occurringEvents.push(event);
      }
    }
    this.closeManageModal();
    this.displayEvents(this.activeTab);
  }

  cancelEvent(event: Event): void {
    if (this.activeTab === 'UPCOMING') {
      const index = this.events.indexOf(event);
      if (index > -1) {
        this.events.splice(index, 1);
      }
    } else if (this.activeTab === 'DRAFTS') {
      const index = this.drafts.indexOf(event);
      if (index > -1) {
        this.drafts.splice(index, 1);
      }
    } else if (this.activeTab === 'RECURRING') {
      const index = this.occurringEvents.indexOf(event);
      if (index > -1) {
        this.occurringEvents.splice(index, 1);
      }
    }
    this.closeManageModal();
    this.displayEvents(this.activeTab);
  }

  displayEvents(tab: string): void {
    this.activeTab = tab;
    if (tab === 'UPCOMING') {
      this.filteredEvents = this.events;
    } else if (tab === 'DRAFTS') {
      this.filteredEvents = this.drafts;
    } else if (tab === 'RECURRING') {
      this.filteredEvents = this.occurringEvents;
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

  response:any; //temporary
  submitForm(type: string): void {
    if (this.eventForm.valid) {
      const newEvent = this.eventForm.value as Event;

      if (type === 'publish') {
        newEvent.event_status_id = 2; //set the status to publish
        console.log(newEvent); //review the details
        this.dataService.createEvent(newEvent).subscribe(res=>{
          this.response=res;
          console.log(this.response);
        })
      } else {
        newEvent.event_status_id = 1; //set the status to draft
        console.log(newEvent); //review the details
        this.dataService.createEvent(newEvent).subscribe(res=>{
          this.response=res;
          console.log(this.response); 
        })
      }
      //Under review
      if (this.isEditMode) {
        if (this.activeTab === 'UPCOMING') {
          if (type === 'publish') {
            this.events[this.editingEventIndex] = newEvent;
          } else {
            this.drafts[this.editingEventIndex] = newEvent;
          }
        } else if (this.activeTab === 'DRAFTS') {
          this.drafts[this.editingEventIndex] = newEvent;
        } else if (this.activeTab === 'RECURRING') {
          this.occurringEvents[this.editingEventIndex] = newEvent;
        }
        this.isEditMode = false;
        this.editingEventIndex = -1;
      } else {
        if (type === 'publish') {
          this.events.push(newEvent);
        } else {
          this.drafts.push(newEvent);
        }
      }
      this.closeModal();
      this.currentStep = 0;
      this.eventForm.reset();
      this.displayEvents(this.activeTab);
    } else {
      alert('Please fill in all required fields.');
    }
  }
}
