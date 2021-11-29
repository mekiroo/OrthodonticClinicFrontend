import {Component, OnInit} from '@angular/core';
import {NgbCalendar, NgbDate, NgbDatepickerI18n, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {VisitTypeService} from '../../../visit-type/visit-type.service';
import {VisitType} from '../../../visit-type/visit-type.model';
import {EmployeeService} from '../../../employee/service/employee.service';
import {Employee} from '../../../employee/model/employee.model';
import {VisitTime} from '../../model/visit-time.model';
import {VisitService} from '../../service/visit.service';
import {AuthService} from '../../../_security/service/auth.service';
import {CreateVisitRequest} from './payload/create-visit.request';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {CustomDatepicker} from './util/custom.datepicker';
import {GlobalConstants} from '../../../_constants/global-constants';
import {EUserRole} from '../../../_security/model/user-role.model';
import {ErrorMessages} from '../../../_constants/error-messages';
import {CustomToastrService} from '../../../_util/custom-toastr-service/custom-toastr.service';

@Component({
  selector: 'app-create-visit',
  templateUrl: './create-visit.component.html',
  styleUrls: ['./create-visit.component.css'],
  providers: [
    {provide: NgbDatepickerI18n, useClass: CustomDatepicker}
  ]
})
export class CreateVisitComponent implements OnInit {
  // Visit type variables
  visitTypes: VisitType[];
  selectedVisitType: VisitType;
  visitTypeDescriptionLoading = false;
  // Employee variables
  employees: Employee[];
  selectedEmployee: Employee;
  employeesLoading = false;
  employeeLoggedIn = false;
  employeeIsOnLeave = false;
  // Visit time variables
  possibleVisitTimes: VisitTime[];
  selectedVisitTime: VisitTime;
  selectedVisitTimeIndex: number;
  // Visit date variables
  dateStruct: NgbDateStruct;
  date: NgbDate;
  selectedVisitDate: string;
  calendarLoading = false;
  // Patient variables
  patientId: number;
  patientFullName: string;
  // Request variables:
  requestSending = false;

  ngOnInit(): void {
    const patient = JSON.parse(window.sessionStorage.getItem(GlobalConstants.SELECTED_PATIENT));
    this.patientId = patient.id;
    this.patientFullName = patient.fullName;
    if (this.authService.getUser().role === EUserRole.EMPLOYEE) {
      this.employeeLoggedIn = true;
    }
    this.getVisitTypes();
  }

  public getVisitTypes(): void {
    this.visitTypeService.getVisitTypes().subscribe(response => {
      this.visitTypes = response;
      if (!this.employeeLoggedIn) {
        this.visitTypes = this.visitTypes.filter(visitType => {
          return visitType.patientCanBook;
        });
      }
    }, error => {
      console.log(error);
    });
  }

  constructor(private visitTypeService: VisitTypeService, private visitService: VisitService,
              private employeeService: EmployeeService, private calendar: NgbCalendar,
              private authService: AuthService, private router: Router,
              private customToastrService: CustomToastrService) {
  }

  public onVisitTypeSelect(visitTypeIndex: number): void {
    this.selectedVisitType = this.visitTypes[visitTypeIndex];
    this.selectedEmployee = null;
    this.selectedVisitDate = null;
    this.selectedVisitTime = null;
    this.populateDescriptionCard();
    this.populateVisitDateCard();
  }

  public onDateSelect(date: NgbDate): void {
    // Convert month and day to ISO format
    const month = date.month < 10 ? '0' + date.month : date.month;
    const day = date.day < 10 ? '0' + date.day : date.day;

    this.selectedVisitDate = date.year + '-' + month + '-' + day;
    this.selectedEmployee = null;
    this.selectedVisitTime = null;
    this.populateEmployeesCard();
  }

  public onEmployeeSelect(employeeIndex: number): void {
    this.selectedEmployee = this.employees[employeeIndex];
    this.populatePossibleVisitTimesCard();
  }

  public onVisitTimeSelect(visitTimeIndex: number): void {
    this.selectedVisitTimeIndex = visitTimeIndex;
    this.selectedVisitTime = this.possibleVisitTimes[visitTimeIndex];
  }

  public onCreateVisit(): void {
    const request: CreateVisitRequest = {
      patientId: this.patientId,
      employeeId: this.selectedEmployee.id,
      visitTypeId: this.selectedVisitType.id,
      description: 'Brak opisu',
      date: this.selectedVisitDate,
      startTime: this.selectedVisitTime.startTime
    };

    this.requestSending = true;
    this.visitService.createVisit(request).subscribe(response => {
      this.requestSending = false;
      this.router.navigate(['/']);
      this.customToastrService.showSuccessToastr('Rezerwacja została utworzona');
    }, error => {
      this.requestSending = false;
      this.customToastrService.showErrorToastr('Niestety operacja nie powiodła się. Spróbuj ponownie');
    });
  }

  isDateDisabled = (date: NgbDate, current: { month: number }) => {
    if (this.calendar.getWeekday(date) === 6 || this.calendar.getWeekday(date) === 7 || date.before(this.calendar.getToday())) {
      return true;
    } else {
      return false;
    }
  };

  public populateDescriptionCard(): void {
    // Show spinner in description card
    this.visitTypeDescriptionLoading = true;
    setTimeout(() => {
      this.visitTypeDescriptionLoading = false;
    }, 150);
  }

  public populateVisitDateCard(): void {
    this.calendarLoading = true;
    setTimeout(() => {
      this.calendarLoading = false;
    }, 150);
    this.dateStruct = null;
  }

  public populateEmployeesCard(): void {
    this.employeesLoading = true;
    this.employeeService.getEmployeesByPositionId(this.selectedVisitType.positionId).subscribe(response => {
        this.employees = response;
        this.employeesLoading = false;
      }, error => {
        console.log(error);
        this.employeesLoading = false;
      }
    );
  }

  public populatePossibleVisitTimesCard(): void {
    this.requestSending = true;

    this.visitService.getPossibleVisitTimes(this.selectedEmployee.id, this.patientId, this.selectedVisitType.id, this.selectedVisitDate)
      .subscribe(response => {
          this.possibleVisitTimes = response;
          this.employeeIsOnLeave = false;
          this.requestSending = false;
        }, error => {
          if (error.error.errors[0] === ErrorMessages.employeeIsOnLeave) {
            this.employeeIsOnLeave = true;
          } else {
            console.log(error);
          }
          this.requestSending = false;
        }
      );
  }
}
