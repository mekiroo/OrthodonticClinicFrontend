import {Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {MdbTableDirective, MdbTablePaginationComponent, ModalDirective} from 'angular-bootstrap-md';
import {VisitService} from '../../service/visit.service';
import {EVisitStatus} from '../../model/visit-status.model';
import {Visit} from '../../model/visit.model';
import {AuthService} from '../../../_security/service/auth.service';
import {EditVisitRequest} from '../../payload/edit-visit.request';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {EVisitStatusPolish} from '../../model/visit-status-polish.model';

@Component({
  selector: 'app-show-todays-employee-visits',
  templateUrl: './show-todays-employee-visits.component.html',
  styleUrls: ['./show-todays-employee-visits.component.css']
})
export class ShowTodaysEmployeeVisitsComponent implements OnInit {
  @ViewChild(MdbTablePaginationComponent, {static: true}) mdbTablePagination: MdbTablePaginationComponent;
  @ViewChild(MdbTableDirective, {static: true}) mdbTable: MdbTableDirective;
  @ViewChild('cancelPopup', {static: true}) cancelPopup: ModalDirective;
  @ViewChild('editVisitPopup', {static: true}) editVisitPopup: ModalDirective;
  visits: any = [];
  previous: any = [];
  searchText = '';
  selectedVisit: any;
  requestSending = false;
  editVisitForm: FormGroup;

  constructor(private visitService: VisitService, private authService: AuthService) {
  }

  public ngOnInit(): void {
    this.getEmployeeTodaysVisits();
  }

  @HostListener('input') oninput(): void {
    this.searchItems();
  }

  public updateTable(): void {
    this.mdbTable.setDataSource(this.visits);
    this.visits = this.mdbTable.getDataSource();
    this.previous = this.mdbTable.getDataSource();
  }

  public searchItems(): void {
    const prev = this.mdbTable.getDataSource();
    if (!this.searchText) {
      this.mdbTable.setDataSource(this.previous);
      this.visits = this.mdbTable.getDataSource();
    }
    if (this.searchText) {
      this.visits = this.mdbTable.searchLocalDataBy(this.searchText);
      this.mdbTable.setDataSource(prev);
    }
  }

  public showCancelPopup(visitIndex: number): void {
    this.selectedVisit = this.visits[visitIndex];
    this.cancelPopup.show();
  }

  public showEditVisitPopup(visitIndex: number): void {
    this.editVisitPopup.show();
    this.selectedVisit = this.visits[visitIndex];
    this.loadEditVisitForm();
  }

  public cancelVisit(): void {
    const cancelDescription = 'Wizyta anulowana przez pracownika';
    const editVisitRequest: EditVisitRequest = {
      visitStatus: EVisitStatus.CANCELED,
      description: cancelDescription
    };

    this.requestSending = true;
    this.visitService.editVisit(this.selectedVisit.patientId, this.selectedVisit.id, editVisitRequest).subscribe(response => {
      this.getEmployeeTodaysVisits();
      this.requestSending = false;
      this.cancelPopup.hide();
    }, error => {
      console.log(error);
      this.requestSending = false;
    });
  }

  public onEditVisit(): void {
    const descriptionFromForm = this.editVisitForm.get('description').value;
    const status = this.editVisitForm.get('status').value;
    const editVisitRequest: EditVisitRequest = {
      visitStatus: this.convertVisitStatus(status),
      description: descriptionFromForm
    };
    this.requestSending = true;
    this.visitService.editVisit(this.selectedVisit.patientId, this.selectedVisit.id, editVisitRequest).subscribe(response => {
      this.editVisitPopup.hide();
      this.getEmployeeTodaysVisits();
      this.requestSending = false;
    }, error => {
      console.log(error);
      this.requestSending = false;
    });
  }

  private getEmployeeTodaysVisits(): void {
    this.requestSending = true;
    const date = this.getCurrentDateInISOFormat();
    const employeeId = this.authService.getUser().userId;
    this.visitService.getEmployeeVisitsByDate(employeeId, date).subscribe(response => {
      this.visits = [];
      response = this.removeCanceledVisits(response);
      response = this.moveCompletedVisitsAtTheEndOfArray(response);
      this.fillVisitsArray(response);
      this.updateTable();
      setTimeout(() => {
        this.requestSending = false;
      }, 200);
    }, error => {
      console.log(error);
      this.requestSending = false;
    });
  }

  private getCurrentDateInISOFormat(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    // Convert month to ISO format
    const monthStr = month < 10 ? '0' + month : month.toString();
    const day = date.getDate();
    // Convert day to ISO format
    const dayStr = day < 10 ? '0' + day : day.toString();
    return year + '-' + monthStr + '-' + dayStr;
  }

  private loadEditVisitForm(): void {
    this.editVisitForm = new FormGroup({
      status: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [Validators.required])
    });
    this.editVisitForm.setValue({
      status: this.selectedVisit.status,
      description: this.selectedVisit.description
    });
  }

  private fillVisitsArray(visitsFromResponse: Visit[]): void {
    for (let i = 0; i < visitsFromResponse.length; i++) {
      this.visits.push({
        index: i,
        id: visitsFromResponse[i].id,
        visitTypeName: visitsFromResponse[i].visitTypeName,
        status: visitsFromResponse[i].visitStatus,
        description: visitsFromResponse[i].description,
        patientId: visitsFromResponse[i].patientId,
        patientFullName: visitsFromResponse[i].patientFirstName + ' ' + visitsFromResponse[i].patientLastName,
        employeeFullName: visitsFromResponse[i].employeeFirstName + ' ' + visitsFromResponse[i].employeeLastName,
        visitTime: visitsFromResponse[i].startTime + ' - ' + visitsFromResponse[i].endTime,
        date: visitsFromResponse[i].date
      });
    }
    this.convertDateInVisitsArray();
    this.convertVisitStatusInVisitsArray();
  }

  private convertDateInVisitsArray(): void {
    for (const element of this.visits) {
      const tempArray = element.date.split('-');
      element.date = tempArray[2] + '.' + tempArray[1] + '.' + tempArray[0];
    }
  }

  private convertVisitStatusInVisitsArray(): void {
    for (const visit of this.visits) {
      if (visit.status === EVisitStatus.WAITING) {
        visit.status = EVisitStatusPolish.WAITING;
      } else if (visit.status === EVisitStatus.COMPLETED) {
        visit.status = EVisitStatusPolish.COMPLETED;
      } else if (visit.status === EVisitStatus.CANCELED) {
        visit.status = EVisitStatusPolish.CANCELED;
      }
    }
  }

  private convertVisitStatus(status: string): string {
    if (status === EVisitStatusPolish.WAITING) {
      return EVisitStatus.WAITING;
    } else if (status === EVisitStatusPolish.COMPLETED) {
      return EVisitStatus.COMPLETED;
    } else if (status === EVisitStatusPolish.CANCELED) {
      return EVisitStatus.CANCELED;
    }
  }

  private removeCanceledVisits(visits: Visit[]): Visit[] {
    for (let i = 0; i < visits.length; i++) {
      if (visits[i].visitStatus === EVisitStatus.CANCELED) {
        visits.splice(i, 1);
        i--;
      }
    }
    return visits;
  }

  private moveCompletedVisitsAtTheEndOfArray(visits: Visit[]): Visit[] {
    const completedVisits = [];
    for (let i = 0; i < visits.length; i++) {
      if (visits[i].visitStatus === EVisitStatus.COMPLETED) {
        const completedVisit = visits.splice(i, 1)[0];
        completedVisits.push(completedVisit);
        i--;
      }
    }
    return visits.concat(completedVisits);
  }
}
