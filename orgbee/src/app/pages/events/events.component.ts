import { Time } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
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
  poster_loc: any; 
  event_status_id: number;
  event_state_id: number;
}

// interface Member {
//   name: string;
// }

// interface SelectedEvent extends Event {
//   registeredMembers?: Member[];
// }

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css'],
})
export class EventsComponent implements OnInit {
  eventForm: FormGroup;
  currentStep = 0;
  activeTab = 'UPCOMING';
  filteredEvents: Event[] = [];
  createEventModal = false;
  editEventModal = false;
  isManageModalVisible = false;
  selectedEvent: Event | null = null;

  showModalUpcoming = false;
  showModalOccuring = false;
  showModalDraft = false;

  response: any; //temporary
  updateEventId: number;

  imgPath: string = 'http://127.0.0.1:8000/storage/images/event_poster/';
  file: any;
  editModalTab:string;
  constructor(private formBuilder: FormBuilder,
    private dataService: DataService) {}

  ngOnInit(): void {
    this.displayEvents(this.activeTab);
    this.eventForm = this.formBuilder.group({
      event_name: 
        ['', {validators: [Validators.required, Validators.maxLength(100)],}],
      location: ['', {validators: [Validators.required],}],
      date: ['', {validators: [Validators.required],}],
      time: ['', {validators: [Validators.required],}],
      all_members_required: ['', {validators: [Validators.required],}],
      has_reg_fee: ['', {validators: [Validators.required],}],
      registration_fee: [{ value: '0', disabled: true }, 
        {validators: [Validators.required],}],
      max_attendees: ['', 
        {validators: [Validators.required, Validators.min(10)],}], 
      caption: ['',
        {validators: [Validators.required,  Validators.maxLength(300)],}], 
      
    });

    this.eventForm.get('has_reg_fee')?.valueChanges.subscribe((value) => {
      const registration_feeControl = this.eventForm.get('registration_fee');
      if (parseInt(value) === 1) {
        registration_feeControl?.enable();
      } else {
        //If registration fee is not required, 
        //set the value of registration fee to 0
        this.eventForm.get('registration_fee').setValue('0'); 
        registration_feeControl?.disable();
      }
    });
  }

  imageValidator(control: FormControl) {
    const imgValue = control.value;
    if (imgValue && imgValue.length > 0) {
      const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif']; 
      const extension = imgValue.split('.').pop().toLowerCase();
      if (allowedExtensions.indexOf(extension) === -1) {
        return { invalidImage: true }; 
      }
    }
    return null;
  }

  //for sample of registered members only
  members = [
    { name: 'John Doe', photo: '../../../assets/icon.jpg' },
    { name: 'Jane Doe', photo: '../../../assets/icon.jpg' },
    { name: 'Jane Dee', photo: '../../../assets/icon.jpg' },
    // Add more members as needed
  ];

  get event_name() {
    return this.eventForm.get('event_name');
  }

  get location() {
    return this.eventForm.get('location');
  }

  get date() {
    return this.eventForm.get('date');
  }

  get time() {
    return this.eventForm.get('time');
  }

  get registration_fee() {
    return this.eventForm.get('registration_fee');
  }

  get max_attendees() {
    return this.eventForm.get('max_attendees');
  }

  get caption() {
    return this.eventForm.get('caption')
  }

  

  openCreateModal(): void {
    this.createEventModal = true;
  }

  closeCreateEditModal(): void {
    this.createEventModal = false;
    this.editEventModal = false;
    this.eventForm.reset();
  }


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

  updateTextCharacterCount(): void {
    const messageControl = this.eventForm.get('caption');
    if (messageControl && messageControl.value.length > 300) {
      messageControl.setValue(messageControl.value.substring(0, 300));
    }
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

  uploadImage(event) {
    console.log(event);
    this.file = event.target.files[0];
    console.log(this.file);
    this.eventForm.get('poster_loc')?.setValue(this.file);
  }

  submitForm(type: string): void {
    console.log(this.eventForm);
    if (this.eventForm.valid) {
      // const newEvent = this.eventForm.value as Event;
      const formData = new FormData();
      const formControls = this.eventForm.controls;

      for (const key in formControls) {
        const value = formControls[key].value;
        formData.append(key, value !== null ? value.toString() : '');
      }
      
      formData.append('poster_loc', this.file, this.file.name);

      if (type === 'publish') {
        formData.append('event_status_id', '2'); //set the status to publish
        console.log(formData); //review the details
        this.dataService.createEvent(formData).subscribe(res=>{
          this.response=res;
          console.log(this.response);
          this.showUpcomingEvents();
        });
      } else {
        formData.append('event_status_id', '1'); //set the status to draft
        console.log(formData); //review the details
        this.dataService.createEvent(formData).subscribe(res=>{
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

  currentPoster:string;
  editEvent(event: Event): void {
    this.editEventModal = true;
    this.closeManageModal();
    this.eventForm.patchValue(event); //pass the value of the selected event
    console.log(event);
    this.updateEventId = event.id;
    this.currentPoster = event.poster_loc;
  }
//TODO: VILLA-VILLA: Allow users to edit posts even without uploading a new poster.
  saveEdit(type:string){
    const formData = new FormData();
    const formControls = this.eventForm.controls;

    for (const key in formControls) {
      const value = formControls[key].value;
        formData.append(key, value !== null ? value.toString() : '');
    }
    formData.append('poster_loc', this.file, this.file.name);
    formData.append('id', this.updateEventId.toString()); 

    if(formData){
      if(type ==='publish'){
        formData.append('event_status_id', '2');
        this.dataService.updateEvent(formData).subscribe(res=>{
          this.response=res;
          console.log(this.response);
          this.showUpcomingEvents();
        });
      } else {
        formData.append('event_status_id', '1');
        this.dataService.updateEvent(formData).subscribe(res=>{
          this.response=res;
          console.log(this.response);
          this.showDraftEvents();
        });
      }
      this.closeCreateEditModal();
      this.currentStep = 0;
      this.eventForm.reset();
    }
  }
}
