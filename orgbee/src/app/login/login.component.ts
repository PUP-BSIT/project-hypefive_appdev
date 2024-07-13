import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControlOptions, 
  ValidatorFn, AbstractControl, FormControl,
  ValidationErrors} from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, of, map } from 'rxjs';

//import { DataService } from '../../service/data.service';
import { LoginService } from '../../service/login-service/login.service';
import { SpinnerService } from '../../service/spinner-service/spinner.service';
import { MustMatch } from './confirmed.validator';
import { ResponseService } 
  from '../../service/response-service/response.service';

interface ResponseData {
  status: number;
  data: {
    token: string;
  };
  message: string;
  code: number;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  signupForm: FormGroup;
  data: ResponseData;
  token: string;
  showSignup = false;
  loadingProgress = 0;

  constructor(
    private formBuilder: FormBuilder, 
    private loginService: LoginService,
    private router: Router,
    private spinnerService: SpinnerService,
    private responseService: ResponseService) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', {
        validators: [Validators.required, Validators.email],
      }],
      password: ['', {
        validators: [Validators.required]
      }]
    });

    this.signupForm = this.formBuilder.group({
      first_name: ['', {
        validators: [Validators.required, this.noNumbersValidator]
      }],
      last_name: ['', {
        validators: [Validators.required, this.noNumbersValidator]
      }],
      student_number: ['', {
        validators: [
          Validators.required, 
          Validators.pattern(/^\d{4}-\d{5}-TG-0$/)],
        asyncValidators:[ this.studentNumChecker.bind(this)]
      }],
      email: ['', {
        validators: [Validators.required, Validators.email,],
        asyncValidators:[ this.emailExists.bind(this)]
      }],
      birthday: ['', {
        validators: [
          Validators.required, 
          this.minAgeValidator(18), 
          this.maxAgeValidator(80)]
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
    } as AbstractControlOptions);

  }

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
  
  emailExists(control:FormControl){
    const email = control.value;
    return this.loginService.searchEmail(email).pipe(
      map((response: string) => {
        return response ? { emailExists: true } : null;
      }),
      catchError((error) => {
        if (!navigator.onLine) {
          this.responseService.handleError
            ('You are offline. Please check your internet connection.');
        } else {
          this.responseService.handleError
            (`An error occurred. Please try again.`);
        }

        // Return an empty observable to complete the pipe
        return of(null);
      })
    );
  }

  studentNumChecker(control:FormControl){
    const studentNum = control.value;
    return this.loginService.searchStudentNum(studentNum).pipe(
      map((response: string) => {
        return response ? { studentNumExists: true } : null;
      }),
      catchError((error) => {
        if (!navigator.onLine) {
          this.responseService.handleError
            ('You are offline. Please check your internet connection.');
        } else {
          this.responseService.handleError
            (`An error occurred. Please try again.`);
        }

        // Return an empty observable to complete the pipe
        return of(null);
      }) 
    );
  }

  onSubmit() {
    this.spinnerService.show('Logging in...');
    if (!this.loginForm.valid) {
      this.spinnerService.hide();
      return;
    }
  
    this.loginService.login(this.loginForm.value).pipe(
      catchError((error) => {
        if (!navigator.onLine) {
          this.responseService.handleError
            ('You are offline. Please check your internet connection.');
        } else {
          this.responseService.handleError
            (`An error occurred. Please try again.`);
        }

        // Return an empty observable to complete the pipe
        return of(null);
      })
    ).subscribe((res: ResponseData)=>{
      this.data = res;
      this.spinnerService.hide();
      if (this.data.status === 1) {
        this.token =this.data.data.token;
        localStorage.setItem('token', this.token);
        this.router.navigate(['/']);
        this.responseService.handleSuccess(this.data.message);
      } else if (this.data.status === 0) {
        this.responseService.handleError(this.data.message);
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
    this.spinnerService.show('Creating account...');
    if (!this.signupForm.valid) {
      this.spinnerService.hide();
      return;
    }

    this.loginService.registerUser(this.signupForm.value).pipe(
      catchError((error) => {
        if (!navigator.onLine) {
          this.responseService.handleError
            ('You are offline. Please check your internet connection.');
        } else {
          this.responseService.handleError
            (`An error occurred. Please try again.`);
        }

        // Return an empty observable to complete the pipe
        return of(null);
      })
    ).subscribe((res: ResponseData)=>{
        this.data = res;
        this.spinnerService.hide();
        if(this.data.status === 1) {
          this.responseService.handleSuccess(this.data.message);
          this.router.navigate(['./verify']);
        } else {
          this.responseService.handleError(this.data.message);
        }

        this.showSignup = false;
        this.signupForm.reset(); //reset fields
    });
  }

  navigateToLanding() {
    this.router.navigate(['/landing-main']);
  }
}
