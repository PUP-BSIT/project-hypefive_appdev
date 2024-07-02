import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControlOptions, 
  ValidatorFn, AbstractControl, FormControl,
  ValidationErrors } from '@angular/forms';
import { MustMatch } from './confirmed.validator';
import { LoginService, UserInfo } from '../../../../service/login.service';
import { UserService } from '../../../../service/user.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ConfirmationDialogService } from '../../../../service/confirmation-dialog.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  updateForm: FormGroup;
  passwordForm: FormGroup;
  deleteForm: FormGroup;
  showInformation = false;
  showAccountManagement = false;
  showAccountDeletion = false;
  showDeleteModal = false;
  showChangeAvatar = true;
  changesMade: boolean = false;
  userInfo: UserInfo;
  selectedAvatarPath: string = ''; 
  currentSelectedAvatar: string = ''; 
  selectedTab: string = 'profile';
  constructor(
    private formBuilder: FormBuilder, 
    private loginService: LoginService,
    private userService: UserService,
    private toastr: ToastrService,
    private router:Router,
    private confirmationDialogService: ConfirmationDialogService) {}

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
      this.selectedAvatarPath = `assets/icons/${this.userInfo.icon_id}.png`; 
    });

    this.deleteForm = this.formBuilder.group ({
      deletion_password: ['', {
        validators: [Validators.required]
      }],
    })

    this.updateForm.valueChanges.subscribe(() => {
      this.changesMade = true;
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

  selectTab(tab: string) {
    this.selectedTab = tab;
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

  get deletion_passwordControl() {
    return this.deleteForm.get('deletion_password');
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

  onUpdateSubmit() {
    this.confirmationDialogService.confirmAction('Update Info Confirmation', 'Are you sure you want to update your information?', () => {
    if (this.updateForm.valid) {
      const updatedUserInfo = {
        ...this.updateForm.value,
        id: this.userInfo.user_id
      };

      this.userService.updateUserInfo(updatedUserInfo)
        .subscribe(
          response => {
            console.log('User info updated successfully:', response);
              // Update userInfo with the response from the server
              this.userInfo = response.updated_student;
          },
            error => {
              console.error('Failed to update user info:', error);
            });
    } else {
        console.log('Form is invalid');
    }
    this.changesMade = false;
  });
}

  cancel() {
    console.log('Cancel button clicked');
    if (this.userInfo) {
      this.populateForm(this.userInfo);
      this.updateForm.markAsPristine(); 
      this.updateForm.markAsUntouched(); 
      this.updateForm.updateValueAndValidity(); 
    }
    this.changesMade = false;
  }

  cancelProfile() {
    this.currentSelectedAvatar='';
    this.selectedAvatarPath = `assets/icons/${this.userInfo.icon_id}.png`; 
  }

  closeModal() {
    this.showSettings = false;
    this.close.emit(); 
  }

  deleteModal() {
    this.confirmationDialogService.confirmAction('Delete Account Confirmation', 'Are you sure you want to delete your account?', () => {
    this.showDeleteModal = true;
    });
  }
  closeDeleteModal() {
    this.showDeleteModal = false;
  }

  changePass() {
    this.confirmationDialogService.confirmAction('Change Password Confirmation', 'Are you sure you want to change your password?', () => {
    if (this.passwordForm.invalid) {
      return;
    }
  
    const currentPassword = this.current_passwordControl.value;
    const newPassword = this.new_passwordControl.value;
    const confirmPassword = this.confirm_passwordControl.value;
  
    this.userService.changePassword(currentPassword, newPassword, confirmPassword).subscribe(
      response => {
        console.log('Password updated successfully:', response);
        this.passwordForm.reset();
        this.toastr.success('Password updated successfully', 'Success', { 
          timeOut: 2000, 
          progressBar: true 
        });
      },
      error => {
        console.error('Error updating password:', error);
        this.toastr.error('Failed to update password', 'Error', { 
          timeOut: 2000, 
          progressBar: true 
        });
      }
    );
  });
  }

  cancelPass() {
    this.passwordForm.reset();
  }

  deleteAccount() {
    this.confirmationDialogService.confirmAction('Delete Account Confirmation', 'Your account will be deleted. Do you still want to proceed?', () => {
    if (this.deleteForm.invalid) {
      return;
    }

    const deletionPassword = this.deleteForm.value.deletion_password;

    this.userService.deactivateUser(this.userInfo.user_id, deletionPassword).subscribe(
      response => {
        this.toastr.success('Account deactivated successfully', 'Success', { 
          timeOut: 2000, 
          progressBar: true 
        });
        this.router.navigate(['/login']);
      },
      error => {
        this.toastr.error('Failed to deactivate user', 'Error', { 
          timeOut: 2000, 
          progressBar: true 
        });
      }
    );
  });
}

  selectAvatar(avatarPath: string): void {
    this.selectedAvatarPath = avatarPath; 
    this.currentSelectedAvatar = avatarPath; 
  }

  saveAvatar() {
    this.confirmationDialogService.confirmAction('Change Avatar Confirmation', 'Are you sure you want to change your avatar?', () => {
    this.loginService.updateIconId(this.getIconIdFromPath(this.selectedAvatarPath)).subscribe(
      response => {
        console.log('Icon updated successfully:', response);
      },
      error => {
        console.error('Failed to update icon:', error);
      }
    );
  });
}

  private getIconIdFromPath(iconPath: string): number {
    const iconId = parseInt(iconPath.split('/').pop().split('.')[0]);
    return iconId;
  }

}
