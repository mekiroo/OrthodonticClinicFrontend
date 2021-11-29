import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {CreatePatientRequest} from '../payload/create-patient.request';
import {Router} from '@angular/router';
import {RegistrationService} from '../service/registration.service';
import {ErrorMessages} from '../../_constants/error-messages';
import {CustomToastrService} from '../../_util/custom-toastr-service/custom-toastr.service';

@Component({
  selector: 'app-register',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  private SUCCESS_MESSAGE = 'Pomyślnie utworzono konto w systemie';
  registerForm: FormGroup;
  sendingRequest = false;
  usernameAlreadyExists = false;
  emailAlreadyExists = false;
  undefinedErrorFromBackend = false;

  constructor(private registrationService: RegistrationService, private router: Router, private customToastrService: CustomToastrService) {
  }

  ngOnInit(): void {
    this.initializeRegisterForm();
  }

  private initializeRegisterForm(): void {
    this.registerForm = new FormGroup({
      firstName: new FormControl(null, [Validators.required]),
      lastName: new FormControl(null, [Validators.required]),
      pesel: new FormControl(null, [Validators.required, Validators.pattern('^[0-9]{11}$')]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      phoneNumber: new FormControl(null, [Validators.required, Validators.pattern('^[0-9]{9}$')]),
      username: new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(30)]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(30)]),
      repeatedPassword: new FormControl(null, [Validators.required, this.checkPasswords.bind(this)]),
    });
  }

  private checkPasswords(repeatedPasswordControl: FormControl): { [s: string]: boolean } {
    if (this.registerForm !== undefined) {
      const password = this.registerForm.get('password').value;
      if (password !== repeatedPasswordControl.value) {
        return {passwordsAreNotTheSame: true};
      }
      return null;
    }
  }

  public onFormSubmit(): void {
    const registrationRequest = this.getCreatePatientRequestFromForm();
    this.sendingRequest = true;
    this.registrationService.register(registrationRequest).subscribe(response => {
      this.sendingRequest = false;
      this.router.navigate(['/']);
      this.customToastrService.showSuccessToastr(this.SUCCESS_MESSAGE);
    }, error => {
      this.sendingRequest = false;
      this.determineTypeOfError(error);
    });
  }

  private getCreatePatientRequestFromForm(): CreatePatientRequest {
    const firstName = this.registerForm.get('firstName').value;
    const lastName = this.registerForm.get('lastName').value;
    const pesel = this.registerForm.get('pesel').value;
    const email = this.registerForm.get('email').value;
    const phoneNumber = this.registerForm.get('phoneNumber').value;
    const username = this.registerForm.get('username').value;
    const password = this.registerForm.get('password').value;

    return {
      firstName,
      lastName,
      pesel,
      email,
      phoneNumber,
      username,
      password
    };
  }

  private determineTypeOfError(error: any): void {
    this.usernameAlreadyExists = false;
    this.emailAlreadyExists = false;
    this.undefinedErrorFromBackend = false;
    const errorMessage = error.error.error;
    if (errorMessage === ErrorMessages.usernameAlreadyExists) {
      this.usernameAlreadyExists = true;
    } else if (errorMessage === ErrorMessages.emailAlreadyExists) {
      this.emailAlreadyExists = true;
    } else {
      this.undefinedErrorFromBackend = true;
    }
  }

}
