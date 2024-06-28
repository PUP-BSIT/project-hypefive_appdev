import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

interface ApiResponse {
  success: boolean;
  message: string;
}

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
    private router: Router
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
      const url = `http://localhost:8000/api/auth/send-reset-link`;
      this.http
        .post<ApiResponse>(url, { email: this.emailForm.value.email })
        .subscribe({
          next: (response) => {
            if (response.success) {
              this.loading = false;
              this.step = 2;
            } else {
              this.loading = false;
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

  verifyCode() {
    if (this.codeForm.valid) {
      this.loading = true;
      const url = `http://localhost:8000/api/auth/verify-code`;
      this.http
        .post<ApiResponse>(url, {
          email: this.emailForm.value.email,
          token: this.codeForm.value.code
        })
        .subscribe({
          next: (response) => {
            if (response.success) {
              this.loading = false;
              this.step = 3; 
            } else {
              this.loading = false;
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

  updatePassword() {
    if (this.passwordForm.valid && !this.passwordForm.hasError('mismatch')) {
      this.loading = true;
      const url = `http://localhost:8000/api/auth/reset-password`;
      this.http
        .post<ApiResponse>(url, {
          email: this.emailForm.value.email,
          password: this.passwordForm.value.newPassword,
          password_confirmation: this.passwordForm.value.confirmPassword
        })
        .subscribe({
          next: (response) => {
            if (response.success) {
              this.loading = false;
              this.step = 4; 
            } else {
              this.loading = false;
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
