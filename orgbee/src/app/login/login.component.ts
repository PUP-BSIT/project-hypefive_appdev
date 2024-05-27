import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DataService } from '../service/data.service';
import { Student } from '../model/student';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  signupForm: FormGroup;
  showSignup: boolean = false;

  students:any;
  student = new Student();
  constructor(private formBuilder:FormBuilder, 
    private dataService:DataService){}

  get emailControl(){
    return this.loginForm.get('email');
  } 

  get passwordControl(){
    return this.loginForm.get('password');
  }

  get signInEmailControl(){
    return this.signupForm.get('email');
  } 

  get signInPasswordControl(){
    return this.signupForm.get('password');
  }

  get firstNameControl(){
    return this.signupForm.get('firstName');
  }
  
  get lastNameControl(){
    return this.signupForm.get('lastName');
  }

  get studentNumberControl(){
    return this.signupForm.get('studentNumber');
  }

  get bdayControl(){
    return this.signupForm.get('bday');
  }

  get genderControl(){
    return this.signupForm.get('gender');
  }

  get confirmPassControl(){
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
      firstName: ['', {
        validators: [Validators.required]
      }],
      lastName: ['', {
        validators: [Validators.required]
      }],
      studentNumber: ['', {
        validators: [Validators.required]
      }],
      email: ['', {
        validators: [Validators.required, Validators.email]
      }],
      bday: ['', {
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
    });
  }

  onSubmit() {
    if (!this.loginForm.valid) return;

    console.log(this.loginForm.value);
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

    this.student = this.signupForm.value;
    console.log(this.student);

    this.dataService.insertData(this.student).subscribe(res=>{
      console.log('saved');
    });
  }

}
