import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css'],
})
export class EventsComponent implements OnInit {
  eventForm: FormGroup; // Form group for event input fields
  currentStep = 0; // Tracks the current step in the form
  activeTab = 'UPCOMING'; // Tracks the active tab
  events: any[] = []; // Array to store upcoming events
  drafts: any[] = []; // Array to store draft events
  occurringEvents: any[] = []; // Array to store occurring events
  filteredEvents: any[] = []; // Array to store events based on active tab
  isModalVisible = false; // To control visibility of modal
  isManageModalVisible = false; // To control visibility of manage modal
  selectedEvent: any; // The event currently being managed
  isEditMode = false; // Flag to track if we are in edit mode
  editingEventIndex = -1; // Index of the event being edited

  constructor(private fb: FormBuilder) {
    this.eventForm = this.fb.group({
      eventName: ['', Validators.required],
      eventLocation: ['', Validators.required],
      eventDate: ['', Validators.required],
      eventTime: ['', Validators.required],
      attendance: ['', Validators.required],
      regFee: ['', Validators.required],
      regAmount: [{ value: '', disabled: true }],
      maxAttendees: ['', Validators.required],
      eventCaption: [''],
      eventPoster: [''],
    });
  }

  ngOnInit(): void {
    this.displayEvents(this.activeTab);
    this.eventForm.get('regFee')?.valueChanges.subscribe((value) => {
      const regAmountControl = this.eventForm.get('regAmount');
      if (value === 'yes') {
        regAmountControl?.enable();
      } else {
        regAmountControl?.disable();
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

  openManageModal(event: any): void {
    this.selectedEvent = event;
    this.isManageModalVisible = true;
  }

  closeManageModal(): void {
    this.isManageModalVisible = false;
  }

  editEvent(event: any): void {
    this.closeManageModal();
    this.openModal();
    this.eventForm.patchValue(event);
    this.isEditMode = true;
    this.editingEventIndex = this.filteredEvents.indexOf(event);
  }

  markAsOccurring(event: any): void {
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

  cancelEvent(event: any): void {
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

  submitForm(type: string): void {
    if (this.eventForm.valid) {
      const newEvent = this.eventForm.value;
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
