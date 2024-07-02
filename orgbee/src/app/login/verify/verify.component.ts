import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { EmailAuthService } from '../../../service/emailauth.service';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrl: './verify.component.css'
})
export class VerifyComponent {
  verifyForm: FormGroup;

  constructor(private fb: FormBuilder, 
      private verifyService: EmailAuthService, 
      private router: Router) {
    this.verifyForm = this.fb.group({
      token: ['', [Validators.required, Validators.minLength(15)]]
    });
  }

  get token() {
    return this.verifyForm.get('token');
  }

  onSubmit() {
    if (this.verifyForm.valid) {
      this.verifyService.verifyEmail(this.verifyForm.value.token).subscribe({
        next: () => this.router.navigate(['/landing-page'], { queryParams: { verified: 1 } }),
        error: () => this.router.navigate(['/login'], { queryParams: { verified: 0 } })
      });
    }
  }
}
