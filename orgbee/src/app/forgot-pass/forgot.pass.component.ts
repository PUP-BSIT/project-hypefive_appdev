import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ForgotPassService } from '../../service/forgotpass.service'

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-pass.component.html',
  styleUrls: ['./forgot-pass.component.css'],
})
export class ForgotPassComponent {
  step: number = 1;
  emailForm: FormGroup;
  codeForm: FormGroup;
  passwordForm: FormGroup;
  loading: boolean = false;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private forgotPassService: ForgotPassService
  ) {
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
    this.codeForm = this.fb.group({
      code: ['', [Validators.required, Validators.minLength(6)]],
    });
    this.passwordForm = this.fb.group(
      {
        newPassword: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validator: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(fg: FormGroup): { [key: string]: boolean } | null {
    const newPassword = fg.get('newPassword')?.value;
    const confirmPassword = fg.get('confirmPassword')?.value;
    if (newPassword !== confirmPassword) {
      return { mismatch: true };
    }
    return null;
  }

  sendVerificationCode() {
    if (this.emailForm.valid) {
      this.loading = true;
      this.forgotPassService.sendResetLink(this.emailForm.value.email).subscribe({
        next: (response) => {
          this.loading = false;
          if (response.success) {
            this.step = 2;
            this.errorMessage = '';
          } else {
            this.errorMessage = response.message;
          }
        },
        error: (error) => {
          this.loading = false;
          if (error.status === 404 && error.error.message === 'Email not found') {
            this.errorMessage = 'Email not found';
          } else {
            this.errorMessage = 'An error occurred. Please try again.';
          }
        },
      });
    }
  }

  verifyCode() {
    if (this.codeForm.valid) {
      this.loading = true;
      this.forgotPassService.verifyCode(this.emailForm.value.email, 
            this.codeForm.value.code)
        .subscribe({
        next: (response) => {
          this.loading = false;
          if (response.success) {
            this.step = 3; 
            this.errorMessage = '';
          } else {
            this.errorMessage = response.message;
          }
        },
        error: (error) => {
          this.loading = false;
          if (error.status === 401 && error.error.message === 'Incorrect token') {
            this.errorMessage = 'Incorrect token';
          } else {
            this.errorMessage = 'An error occurred. Please try again.';
          }
        },
      });
    }
  }
  
  updatePassword() {
    if (this.passwordForm.valid && !this.passwordForm.hasError('mismatch')) {
      this.loading = true;
      this.forgotPassService.resetPassword(this.emailForm.value.email, 
            this.passwordForm.value.newPassword, 
            this.passwordForm.value.confirmPassword)
        .subscribe({
        next: (response) => {
          this.loading = false;
          if (response.success) {
            this.step = 4; 
          } else {
            this.errorMessage = response.message;
          }
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = error.message;
        },
      });
    }
  }

  redirectToLogin() {
    this.router.navigate(['/login']);
  }
}
