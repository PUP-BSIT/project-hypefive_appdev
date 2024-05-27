import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DataService } from '../../service/data.service';
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

  get signUpEmailControl(){
    return this.signupForm.get('email');
  } 

  get signUpPasswordControl(){
    return this.signupForm.get('password');
  }

  get firstNameControl(){
    return this.signupForm.get('first_name');
    return this.signupForm.get('first_name');
  }
  
  get lastNameControl(){
    return this.signupForm.get('last_name');
    return this.signupForm.get('last_name');
  }

  get studentNumberControl(){
    return this.signupForm.get('student_number');
    return this.signupForm.get('student_number');
  }

  get bdayControl(){
    return this.signupForm.get('birthday'); 
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
      first_name: ['', {
        validators: [Validators.required]
      }],
      last_name: ['', {
        validators: [Validators.required]
      }],
      student_number: ['', {
        validators: [Validators.required]
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


    
    this.dataService.insertData(this.signupForm.value).subscribe(res=>{
      console.log('saved');
    });
  }

}
