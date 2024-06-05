import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControlOptions } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

import { DataService } from '../../service/data.service';
import { Student } from '../model/student';
import { MustMatch } from './confirmed.validator';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  signupForm: FormGroup;
  showSignup: boolean = false;

  student = new Student();
  data: any;
  token: any;
  constructor(private formBuilder:FormBuilder, 
    private dataService:DataService, 
    private toastr: ToastrService,
    private router:Router) {}

  get emailControl() {
    return this.loginForm.get('email');
  } 

  get passwordControl() {
    return this.loginForm.get('password');
  }

  get signUpEmailControl() {
    return this.signupForm.get('email');
  } 

  get signUpPasswordControl() {
    return this.signupForm.get('password');
  }

  get firstNameControl() {
    return this.signupForm.get('first_name');
  }
  
  get lastNameControl() {
    return this.signupForm.get('last_name');
  }

  get studentNumberControl() {
    return this.signupForm.get('student_number');
  }

  get bdayControl() {
    return this.signupForm.get('birthday'); 
  }

  get genderControl() {
    return this.signupForm.get('gender');
  }

  get confirmPassControl() {
    return this.signupForm.get('confirmPassword');
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group( {
      email: ['', {
        validators: [Validators.required, Validators.email],
      }],
      password: ['', {
        validators: [Validators.required]
      }]
    });

    this.signupForm = this.formBuilder.group({
      first_name: ['', {
        validators: [Validators.required]
      }],
      last_name: ['', {
        validators: [Validators.required]
      }],
      student_number: ['', {
        validators: [
          Validators.required, 
          Validators.pattern(/^\d{4}-\d{5}-TG-0$/)]
      }],
      email: ['', {
        validators: [Validators.required, Validators.email]
      }],
      birthday: ['', {
        validators: [Validators.required]
      }],
      gender: ['', {
        validators: [Validators.required]
      }],
      password: ['', {
        validators: [Validators.required, Validators.minLength(8)]
      }],
      confirmPassword: ['', {
        validators: [Validators.required]
      }]
    }, {
      validator: MustMatch('password', 'confirmPassword')
    }as AbstractControlOptions);
  }

  onSubmit() {
    if (!this.loginForm.valid) return;

    this.dataService.login(this.loginForm.value).subscribe(res=>{
      this.data = res;
      
      if (this.data.status === 1) {
        this.token =this.data.data.token;
        localStorage.setItem('token', this.token);
        this.router.navigate(['/']);

        this.toastr.success(JSON.stringify(this.data.message), JSON.stringify(this.data.code),{
          timeOut: 2000,
          progressBar:true
        });
      } else if(this.data.status === 0){
        this.toastr.error(JSON.stringify(this.data.message), JSON.stringify(this.data.code),{
          timeOut: 2000,
          progressBar:true
        });
      }
    });
  }

  showSignupPopup() {
    this.showSignup = true;
    return false;
  }

  hideSignupPopup() {
    this.showSignup = false;
  }

  onSignupSubmit() {
    if (!this.signupForm.valid) return;

    this.dataService.registerUser(this.signupForm.value).subscribe(res=>{
      this.data=res;
      if(this.data.status === 1) {
        this.toastr.success(JSON.stringify(this.data.message), JSON.stringify(this.data.code),{
          timeOut:2000,
          progressBar: true
        });
      } else {
        this.toastr.error(JSON.stringify(this.data.message), JSON.stringify(this.data.code),{
          timeOut:2000,
          progressBar: true
        });
      }

      this.showSignup = false;
      this.signupForm.reset();//reset fields
    });
  }

}
