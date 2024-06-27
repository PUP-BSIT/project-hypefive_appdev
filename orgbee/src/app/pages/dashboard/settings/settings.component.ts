import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControlOptions, 
  ValidatorFn, AbstractControl, FormControl,
  ValidationErrors } from '@angular/forms';
import { MustMatch } from './confirmed.validator';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  updateForm: FormGroup;
  passwordForm: FormGroup;
  showInformation = false;
  showAccountManagement = false;

  constructor(private formBuilder: FormBuilder) {}

  @Input() showSettings: boolean = false;
  @Output() close: EventEmitter<void> = new EventEmitter<void>();

  ngOnInit(): void {
    this.updateForm = this.formBuilder.group({
      first_name: ['', {
        validators: [Validators.required, this.noNumbersValidator]
      }],
      last_name: ['', {
        validators: [Validators.required, this.noNumbersValidator]
      }],
      student_number: ['', {
        validators: [
          Validators.required, 
          Validators.pattern(/^\d{4}-\d{5}-TG-0$/)
        ]
      }],
      email: ['', {
        validators: [Validators.required, Validators.email]
      }],
      birthday: ['', {
        validators: [
          Validators.required, 
          this.minAgeValidator(18), 
          this.maxAgeValidator(80)
        ]
      }],
      gender: ['', {
        validators: [Validators.required]
      }],
    });

    this.passwordForm = this.formBuilder.group ({
      current_password: ['', {
        validators: [Validators.required]
      }],
      new_password: ['', {
        validators: [Validators.required, Validators.minLength(8)]
      }],
      confirm_password: ['', {
        validators: [Validators.required]
      }]
     }, {
      validator: MustMatch('new_password', 'confirm_password')
    } as AbstractControlOptions);
  }

  get emailControl() {
    return this.updateForm.get('email');
  }

  get firstNameControl() {
    return this.updateForm.get('first_name');
  }
  
  get lastNameControl() {
    return this.updateForm.get('last_name');
  }

  get studentNumberControl() {
    return this.updateForm.get('student_number');
  }

  get bdayControl() {
    return this.updateForm.get('birthday'); 
  }

  get genderControl() {
    return this.updateForm.get('gender');
  }

  get current_passwordControl() {
    return this.passwordForm.get('current_password');
  }

  get new_passwordControl() {
    return this.passwordForm.get('new_password');
  }

  get confirm_passwordControl() {
    return this.passwordForm.get('confirm_password');
  }

  noNumbersValidator(control: FormControl) {
    const containsNumbers = /[0-9]/.test(control.value);
    return containsNumbers ? { containsNumbers: true } : null;
  }

  maxAgeValidator(maxAge: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value) {
        const today = new Date();
        const birthDate = new Date(control.value);
        const age = today.getFullYear() - birthDate.getFullYear();

        if (age > maxAge) {
          return { 'maxAge': { value: age } };
        }
      }
      return null;
    };
  }

  minAgeValidator(minAge: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value) {
        const today = new Date();
        const birthDate = new Date(control.value);
        const age = today.getFullYear() - birthDate.getFullYear();

        if (age < minAge) {
          return { 'minAge': { value: age } };
        }
      }
      return null;
    };
  }

  displayAccountInfo() {
    this.showInformation = true;
    this.showAccountManagement = false;
  }

  displayAccountManagement() {
    this.showAccountManagement = true;
    this.showInformation = false;
  }

  onUpdateSubmit() {
    if (this.updateForm.valid) {
      console.log('Form submitted:', this.updateForm.value);
    } else {
      console.log('Form is invalid');
    }
  }

  cancel() {
    this.updateForm.reset();
  }

  closeModal() {
    this.showSettings = false;
    this.close.emit(); 
  }
}
