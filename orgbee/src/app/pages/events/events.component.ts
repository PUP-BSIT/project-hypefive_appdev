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
  filteredEvents: any[] = []; // Array to store events based on active tab
  isModalVisible = false; // To control visibility of modal

  // Initialize the form group with form controls and validators
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
    // Display events based on the active tab 
    this.displayEvents(this.activeTab);

    // Enable/disable if nag yes si user
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
    // Open the modal
    this.isModalVisible = true;
  }

  closeModal(): void {
    // Close the modal
    this.isModalVisible = false;
  }

  displayEvents(tab: string): void {
    // Update active tab and filter events accordingly
    this.activeTab = tab;

    if (tab === 'UPCOMING') {
      this.filteredEvents = this.events; // Display upcoming events
    } else if (tab === 'DRAFTS') {
      this.filteredEvents = this.drafts; // Display draft events
    }
  }

  get formControls() {
    // Getter for form controls to simplify template code
    return this.eventForm.controls;
  }

  nextStep(): void {
    // Move to the next step in a multi-step form
    if (this.currentStep < 3) {
      this.currentStep++;
    }
  }

  prevStep(): void {
    // Move to the previous step in a multi-step form
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  submitForm(type: string): void {
    // Submit the form and add the event to either events or drafts 
    if (this.eventForm.valid) {
      const newEvent = { 
        eventName: this.eventForm.value.eventName,
        eventLocation: this.eventForm.value.eventLocation,
        eventDate: this.eventForm.value.eventDate,
        eventTime: this.eventForm.value.eventTime,
        attendance: this.eventForm.value.attendance,
        regFee: this.eventForm.value.regFee,
        regAmount: this.eventForm.value.regAmount,
        maxAttendees: this.eventForm.value.maxAttendees,
        eventCaption: this.eventForm.value.eventCaption,
        eventPoster: this.eventForm.value.eventPoster,
      };

      if (type === 'publish') { 
        this.events.push(newEvent);
      } else { 
        this.drafts.push(newEvent);
      }

      this.closeModal();
      this.currentStep = 0;
      this.eventForm.reset();
      this.displayEvents(this.activeTab);
    } else {
      // alert user to fill in all required fields
      alert('Please fill in all required fields.');
    }
  }
}
