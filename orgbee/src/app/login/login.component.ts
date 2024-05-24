import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
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
  constructor(private dataService:DataService){}

  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
    });

    this.signupForm = new FormGroup({
      first_name: new FormControl('', Validators.required),
      last_name: new FormControl('', Validators.required),
      student_number: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      birthday: new FormControl('', Validators.required),
      gender: new FormControl('', Validators.required),
      password: new FormControl('', 
        [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('', Validators.required)
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
