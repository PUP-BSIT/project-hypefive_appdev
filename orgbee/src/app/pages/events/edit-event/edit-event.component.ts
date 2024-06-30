import { Component, OnInit, Input, Output, EventEmitter, 
    OnChanges, SimpleChanges  } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { DataService } from '../../../../service/data.service';
import { Response } from '../../../app.component';
import { Event } from '../events.component';
import { SpinnerService } from '../../../../service/spinner.service';

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrl: '../create-event/create-event.component.css'
})

export class EditEventComponent implements OnInit {
  @Input() editEventModal: boolean;
  @Input() selectedEvent: Event;
  @Input() activeTab:string;

  @Output() closeModal = new EventEmitter<void>();
  @Output() eventUpdate = new EventEmitter<string>();

  eventForm:FormGroup;
  currentPoster:string;
  response:Response;

  currentStep= 0;
  file: File;
  preview:string;

  updateEventId:number;
  imgPath: string = 'http://127.0.0.1:8000/storage/images/event_poster/';
  constructor (private formBuilder: FormBuilder, 
    private dataService: DataService,
    private toastr: ToastrService,
    private spinnerService: SpinnerService
  ) {}

  ngOnInit(): void {
    this.eventForm = this.formBuilder.group({
      event_name: ['', 
        {validators: [Validators.required, Validators.maxLength(100)],}],
      location: ['', {validators: [Validators.required],}],
      date: ['', 
        {validators: [Validators.required, this.futureDateValidator],}],
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

  ngOnChanges(changes: SimpleChanges) {
    if (changes.selectedEvent && changes.selectedEvent.currentValue) {
      this.eventForm.patchValue(this.selectedEvent);
      this.updateEventId = this.selectedEvent.id;
      this.currentPoster = this.selectedEvent.poster_loc;
      this.preview = this.imgPath+this.currentPoster; 
    }
  }

  updateTextCharacterCount(): void {
    const messageControl = this.eventForm.get('caption');
    if (messageControl && messageControl.value.length > 300) {
      messageControl.setValue(messageControl.value.substring(0, 300));
    }
  }

  futureDateValidator(control: FormControl) {
    const inputDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return inputDate >= today ? null : { pastDate: true };
  }

  isStepValid(stepIndex: number): boolean {
    switch (stepIndex) {
      case 0:
        return this.eventForm.get('event_name').valid
              && this.eventForm.get('location').valid
              && this.eventForm.get('date').valid
              && this.eventForm.get('time').valid;
      case 1:
        return this.eventForm.get('all_members_required').valid
              && this.eventForm.get('has_reg_fee').valid
              && this.eventForm.get('max_attendees').valid;
      case 2:
        return this.eventForm.get('caption').valid;
      default:
        return false;
    }
  }

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

  nextStep(): void {
    if (this.currentStep < 3) {
      if (this.isStepValid(this.currentStep)) {
        this.currentStep++;
      } else {
        this.eventForm.markAllAsTouched(); 
      }
    }
  }

  prevStep(): void {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  closeCreateEditModal(){
    this.closeModal.emit();
    this.currentStep = 0;
    this.eventForm.patchValue(this.selectedEvent);
  }
  
  uploadImage(event) {
    this.file = event.target.files[0];
    if(event.target.files){
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload=(event:any)=>{
        this.preview=event.target.result;
      }
    }
  }

  saveEdit(type:string){
    const formData = new FormData();
    const formControls = this.eventForm.controls;

    for (const key in formControls) {
      const value = formControls[key].value;
        formData.append(key, value !== null ? value.toString() : '');
    }
    if (this.file){
      formData.append('poster_loc', this.file);
    } else {
      formData.append('poster_loc', this.currentPoster);
    }
   
    formData.append('id', this.updateEventId.toString()); 

    if(formData){
      if(type ==='publish') {
        this.spinnerService.show('Updating event details...')
        formData.append('event_status_id', '2');
        this.dataService.updateEvent(formData).subscribe((res:Response)=>{
          this.response=res;
          this.handleResponse();
          this.eventUpdate.emit('upcoming');
          this.spinnerService.hide();
        });
      } else if(type ==='draft') {
        this.spinnerService.show('Saving to drafts...')
        formData.append('event_status_id', '1');
        this.dataService.updateEvent(formData).subscribe((res:Response)=>{
          this.response=res;
          this.handleResponse();
          this.spinnerService.hide();

          if(this.activeTab === 'UPCOMING'){
            this.eventUpdate.emit('upcoming');
          } else if ((this.activeTab === 'DRAFTS')) {
            this.eventUpdate.emit('draft');
          }
        });
      }
      this.closeCreateEditModal();
      this.currentStep = 0;
      this.eventForm.reset();
    }
  }

  handleResponse(){
    if (this.response.code === 200) {
      this.toastr.success(JSON.stringify(this.response.message), '', {
        timeOut: 2000,
        progressBar: true,
        toastClass: 'custom-toast success'
      });
    } else {
      this.toastr.error(JSON.stringify(this.response.message), '', {
        timeOut: 2000,
        progressBar: true,
        toastClass: 'custom-toast error'
      });
    }
  }
}
