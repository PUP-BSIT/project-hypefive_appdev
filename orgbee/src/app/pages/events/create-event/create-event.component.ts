import { Component, OnInit, Input, Output, EventEmitter  } from '@angular/core';

import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { DataService } from '../../../../service/data.service';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrl: './create-event.component.css'
})
export class CreateEventComponent {
  eventForm: FormGroup;
  currentStep:number = 0;
  preview: string;

  response: any;
  file: any;

  @Input() createEventModal:boolean;
  @Output() closeModal = new EventEmitter<void>();  
  @Output() eventCreated = new EventEmitter<void>();
  @Output() draftSaved = new EventEmitter<void>();

  constructor (private formBuilder: FormBuilder, 
    private dataService: DataService
  ) {}

  ngOnInit(): void {
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

  updateTextCharacterCount(): void {
    const messageControl = this.eventForm.get('caption');
    if (messageControl && messageControl.value.length > 300) {
      messageControl.setValue(messageControl.value.substring(0, 300));
    }
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
              //  && this.eventForm.get('poster_loc').valid;
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

  closeCreateEditModal(){
    this.closeModal.emit();
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
    this.file = event.target.files[0];
    if(event.target.files){
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload=(event:any)=>{
        this.preview=event.target.result;
      }
    }
  }

  submitForm(type: string): void {
    if (this.eventForm.valid) {
      const formData = new FormData();
      const formControls = this.eventForm.controls;

      for (const key in formControls) {
        const value = formControls[key].value;
        formData.append(key, value !== null ? value.toString() : '');
      }
      
      formData.append('poster_loc', this.file);

      if (type === 'publish') {
        formData.append('event_status_id', '2'); //set the status to publish
        console.log(formData); //review the details
        this.dataService.createEvent(formData).subscribe(res=>{
          this.response=res;
          this.eventCreated.emit();
        });
      } else {
        formData.append('event_status_id', '1'); //set the status to draft
        console.log(formData); //review the details
        this.dataService.createEvent(formData).subscribe(res=>{
          this.response=res;
          this.draftSaved.emit();
        });
      }
      
      this.closeCreateEditModal();
      this.currentStep = 0;
      this.eventForm.reset();
    } else { 
      alert('Please fill in all required fields.');
    }
  }
}
