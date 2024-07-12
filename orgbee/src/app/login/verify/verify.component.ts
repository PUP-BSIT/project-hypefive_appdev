import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EmailAuthService } 
  from '../../../service/emailauth-service/emailauth.service';
import { ResponseService } 
  from '../../../service/response-service/response.service';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrl: './verify.component.css'
})
export class VerifyComponent {
  verifyForm: FormGroup;

  constructor(private fb: FormBuilder, 
      private verifyService: EmailAuthService, 
      private responseService: ResponseService,
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
        next: () => {
          this.responseService.handleSuccess('Email verified successfully!');
          this.router.navigate(['/landing-page'], 
            { queryParams: { verified: 1 } });
        },
        error: (err) => {
          this.responseService.handleError(`Verification failed. 
            Please try again.`);
        }
      });
    }
  }
}
