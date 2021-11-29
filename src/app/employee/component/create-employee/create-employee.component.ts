import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {CreateEmployeeRequest} from '../../payload/create-employee.request';
import {EmployeeService} from '../../service/employee.service';
import {Position} from '../../model/position.model';
import {ErrorMessages} from '../../../_constants/error-messages';
import {Router} from '@angular/router';
import {CustomToastrService} from '../../../_util/custom-toastr-service/custom-toastr.service';

@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.css']
})
export class CreateEmployeeComponent implements OnInit {
  private SUCCESS_MESSAGE = 'Pomyślnie utworzono konto pracownika w systemie';
  createEmployeeForm: FormGroup;
  employeePositions: Position[];
  sendingRequest = false;
  usernameAlreadyExists = false;
  emailAlreadyExists = false;
  undefinedErrorFromBackend = false;

  constructor(private employeeService: EmployeeService, private router: Router, private customToastrService: CustomToastrService) {
  }

  ngOnInit(): void {
    this.fillEmployeePositionsArray();
    this.initializeCreateEmployeeForm();
  }

  private fillEmployeePositionsArray(): void {
    this.employeeService.getEmployeePositions().subscribe(response => {
      this.employeePositions = response;
    }, error => {
      console.log(error);
    });
  }

  private initializeCreateEmployeeForm(): void {
    this.createEmployeeForm = new FormGroup({
      firstName: new FormControl(null, [Validators.required]),
      lastName: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      phoneNumber: new FormControl(null, [Validators.required, Validators.pattern('^[0-9]{9}$')]),
      positionName: new FormControl(null, [Validators.required]),
      username: new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(30)]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(30)]),
      repeatedPassword: new FormControl(null, [Validators.required, this.checkPasswords.bind(this)])
    });
  }

  private checkPasswords(repeatedPasswordControl: FormControl): { [s: string]: boolean } {
    if (this.createEmployeeForm !== undefined) {
      const password = this.createEmployeeForm.get('password').value;
      if (password !== repeatedPasswordControl.value) {
        return {passwordsAreNotTheSame: true};
      }
      return null;
    }
  }

  public onFormSubmit(): void {
    const createEmployeeRequest = this.getCreateEmployeeRequestFromForm();
    this.sendingRequest = true;
    this.employeeService.createEmployee(createEmployeeRequest).subscribe(response => {
      this.sendingRequest = false;
      this.router.navigate(['/']);
      this.customToastrService.showSuccessToastr(this.SUCCESS_MESSAGE);
    }, error => {
      console.log(error);
      this.sendingRequest = false;
      this.determineTypeOfError(error);
    });
  }

  private getCreateEmployeeRequestFromForm(): CreateEmployeeRequest {
    const firstName = this.createEmployeeForm.get('firstName').value;
    const lastName = this.createEmployeeForm.get('lastName').value;
    const email = this.createEmployeeForm.get('email').value;
    const phoneNumber = this.createEmployeeForm.get('phoneNumber').value;
    const username = this.createEmployeeForm.get('username').value;
    const password = this.createEmployeeForm.get('password').value;
    const positionName = this.createEmployeeForm.get('positionName').value;
    const positionId = this.getPositionIdByNameFromEmployeePositionsArray(positionName);

    return {
      username,
      password,
      firstName,
      lastName,
      email,
      phoneNumber,
      positionId
    };
  }

  private getPositionIdByNameFromEmployeePositionsArray(positionName: string): number {
    for (const employeePosition of this.employeePositions) {
      if (employeePosition.name === positionName) {
        return employeePosition.id;
      }
    }
  }

  private determineTypeOfError(error: any): void {
    this.usernameAlreadyExists = false;
    this.emailAlreadyExists = false;
    this.undefinedErrorFromBackend = false;
    const errors = error.error.errors;
    if (errors.includes(ErrorMessages.usernameAlreadyExists)) {
      this.usernameAlreadyExists = true;
    }
    if (errors.includes(ErrorMessages.emailAlreadyExists)) {
      this.emailAlreadyExists = true;
    }
    if (!(this.usernameAlreadyExists || this.emailAlreadyExists)) {
      this.undefinedErrorFromBackend = true;
    }
  }

}
