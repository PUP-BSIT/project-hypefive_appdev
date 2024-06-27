import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrl: './verify.component.css'
})
export class VerifyComponent {
  verifyForm: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.verifyForm = this.fb.group({
      token: ['', [Validators.required, Validators.minLength(15)]]
    });
  }

  get token() {
    return this.verifyForm.get('token');
  }

  onSubmit() {
    if (this.verifyForm.valid) {
      this.http.post('http://localhost:8000/api/verify', { token: this.verifyForm.value.token })
        .subscribe(
          () => this.router.navigate(['/login'], { queryParams: { verified: 1 } }),
          () => this.router.navigate(['/login'], { queryParams: { verified: 0 } })
        );
    }
  }
}
