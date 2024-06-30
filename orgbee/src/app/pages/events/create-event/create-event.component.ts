import { Component, OnInit, Input, Output, EventEmitter  } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { DataService } from '../../../../service/data.service';
import { Response } from '../../../app.component';
import { SpinnerService } from '../../../../service/spinner.service';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrl: './create-event.component.css'
})

export class CreateEventComponent implements OnInit {
  @Input() createEventModal:boolean;
  @Output() closeModal = new EventEmitter<void>();  
  @Output() eventCreated = new EventEmitter<void>();
  @Output() draftSaved = new EventEmitter<void>();

  eventForm: FormGroup;
  currentStep:number = 0;
  preview: string;
  response: Response;
  file: File;

  constructor (
    private formBuilder: FormBuilder, 
    private dataService: DataService, 
    private toastr: ToastrService,
    private spinnerService: SpinnerService
  ) {}

  ngOnInit(): void {
    this.eventForm = this.formBuilder.group({
      event_name: 
        ['', {validators: [Validators.required, Validators.maxLength(100)],}],
      location: ['', {validators: [Validators.required],}],
      date: ['', {validators: [Validators.required, this.futureDateValidator],}],
      time: ['', {validators: [Validators.required],}],
      all_members_required: ['', {validators: [Validators.required],}],
      has_reg_fee: ['', {validators: [Validators.required],}],
      registration_fee: [{ value: '0', disabled: true }, 
        {validators: [Validators.required],}],
      max_attendees: ['', 
        {validators: [Validators.required, Validators.min(10)],}], 
      caption: ['',
        {validators: [Validators.required,  Validators.maxLength(300)],}],
      poster_loc: ['', {validators: [Validators.required],}],
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
        return this.eventForm.get('caption').valid
               && this.eventForm.get('poster_loc').valid;
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
    return this.eventForm.get('caption');
  }

  get poster_loc() {
    return this.eventForm.get('poster_loc');
  }

  closeCreateEditModal(){
    this.closeModal.emit();
    this.eventForm.reset();
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
        this.spinnerService.show('Publishing event...')
        formData.append('event_status_id', '2'); //set the status to publish
        this.dataService.createEvent(formData).subscribe((res:Response)=>{
          this.response=res;
          this.handleResponse();
          this.eventCreated.emit();
          this.spinnerService.hide();
        });
      } else {
        this.spinnerService.show('Saving to drafts...')
        formData.append('event_status_id', '1'); //set the status to draft
        this.dataService.createEvent(formData).subscribe((res:Response)=>{
          this.response=res;
          this.handleResponse();
          this.draftSaved.emit();
        });
      }
      
      this.closeCreateEditModal();
      this.currentStep = 0;
      this.eventForm.reset();
      // this.file = '';
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
