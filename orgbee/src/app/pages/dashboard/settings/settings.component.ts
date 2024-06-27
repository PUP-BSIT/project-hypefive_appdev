import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControlOptions, 
  ValidatorFn, AbstractControl, FormControl,
  ValidationErrors } from '@angular/forms';
import { MustMatch } from './confirmed.validator';
import { LoginService, UserInfo } from '../../../../service/login.service';
import { UserService } from '../../../../service/user.service';


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
  userInfo: UserInfo;
  constructor(
    private formBuilder: FormBuilder, 
    private loginService: LoginService,
  private userService: UserService) {}

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

    this.loginService.onDataRetrieved((userInfo: UserInfo) => {
      this.userInfo = userInfo;
      this.populateForm(userInfo);
    });
  }

  private populateForm(userInfo: UserInfo): void {
    this.updateForm.patchValue({
      first_name: userInfo.first_name,
      last_name: userInfo.last_name,
      student_number: userInfo.student_number,
      birthday: userInfo.birthday,
      gender: userInfo.gender.toLowerCase()
    });
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
      const id = this.userInfo.user_id; 
      this.userService.updateUserInfo(id, this.updateForm.value)
        .subscribe(
          response => {
            console.log('This is on submit User info updated successfully:', response);
            // Update userInfo with the response from the server
            this.userInfo = response.updated_student; 
          },
          error => {
            console.error('Failed to update user info:', error);
          }
        );
    } else {
      console.log('Form is invalid');
    }
  }

  cancel() {
    console.log('Cancel button clicked');
    if (this.userInfo) {
      this.populateForm(this.userInfo);
      this.updateForm.markAsPristine(); // Mark form as pristine
      this.updateForm.markAsUntouched(); // Mark form controls as untouched
      this.updateForm.updateValueAndValidity(); // Update form validation state
    }
  }

  closeModal() {
    this.showSettings = false;
    this.close.emit(); 
  }
}
