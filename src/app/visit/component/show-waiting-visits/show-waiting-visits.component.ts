import {AfterViewInit, ChangeDetectorRef, Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {MdbTableDirective, MdbTablePaginationComponent, ModalDirective} from 'angular-bootstrap-md';
import {VisitService} from '../../service/visit.service';
import {AuthService} from '../../../_security/service/auth.service';
import {EVisitStatus} from '../../model/visit-status.model';
import {EUserRole} from '../../../_security/model/user-role.model';
import {EditVisitRequest} from '../../payload/edit-visit.request';
import {Visit} from '../../model/visit.model';
import {EVisitStatusPolish} from '../../model/visit-status-polish.model';

@Component({
  selector: 'app-show-waiting-visits',
  templateUrl: './show-waiting-visits.component.html',
  styleUrls: ['./show-waiting-visits.component.css']
})
export class ShowWaitingVisitsComponent implements OnInit, AfterViewInit {
  @ViewChild(MdbTablePaginationComponent, {static: true}) mdbTablePagination: MdbTablePaginationComponent;
  @ViewChild(MdbTableDirective, {static: true}) mdbTable: MdbTableDirective;
  @ViewChild('cancelPopup', {static: true}) cancelVisitPopup: ModalDirective;
  visits: any = [];
  previous: any = [];
  patientLoggedIn: boolean;
  userFullName: string;
  searchText = '';
  selectedVisit: any;
  requestSending = false;

  constructor(private visitService: VisitService, private authService: AuthService, private cdRef: ChangeDetectorRef) {
  }

  public ngOnInit(): void {
    const user = this.authService.getUser();
    this.userFullName = user.firstName + ' ' + user.lastName;
    const userRole = user.role;
    if (userRole === EUserRole.PATIENT) {
      this.patientLoggedIn = true;
      this.getPatientVisits();
    } else {
      this.patientLoggedIn = false;
      this.getEmployeeVisits();
    }
  }

  @HostListener('input') oninput(): void {
    this.searchItems();
  }

  ngAfterViewInit(): void {
    this.mdbTablePagination.setMaxVisibleItemsNumberTo(5);
    this.mdbTablePagination.calculateFirstItemIndex();
    this.mdbTablePagination.calculateLastItemIndex();
    this.cdRef.detectChanges();
  }

  public getPatientVisits(): void {
    const patientId = this.authService.getUser().userId;

    this.requestSending = true;
    this.visitService.getPatientVisitByVisitStatus(patientId, EVisitStatus.WAITING).subscribe(response => {
      this.fillVisitsArray(response);
      this.updatePaginationTable();
      setTimeout(() => {
        this.requestSending = false;
      }, 200);
    }, error => {
      console.log(error);
      this.requestSending = false;
    });
  }

  public getEmployeeVisits(): void {
    const employeeId = this.authService.getUser().userId;

    this.requestSending = true;
    this.visitService.getEmployeeVisitsByVisitStatus(employeeId, EVisitStatus.WAITING).subscribe(response => {
      this.fillVisitsArray(response);
      this.updatePaginationTable();
      setTimeout(() => {
        this.requestSending = false;
      }, 200);
    }, error => {
      console.log(error);
      this.requestSending = false;
    });
  }

  public reverseVisitsArray(): void {
    this.visits = this.visits.reverse();
  }

  public updatePaginationTable(): void {
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

  public setVisitToCancel(index: number): void {
    this.selectedVisit = this.visits[index];
  }

  public cancelVisit(): void {
    const comment = this.getCancelMessageBasedOnLoggedUser();
    const editVisitRequest: EditVisitRequest = {
      visitStatus: EVisitStatus.CANCELED,
      description: comment
    };

    this.requestSending = true;
    this.visitService.editVisit(this.selectedVisit.patientId, this.selectedVisit.id, editVisitRequest).subscribe(response => {
      const visitIndex = this.visits.indexOf(this.selectedVisit);
      this.visits.splice(visitIndex, 1);
      this.updatePaginationTable();
      this.requestSending = false;
      this.cancelVisitPopup.hide();
    }, error => {
      console.log(error);
      this.requestSending = false;
    });
  }

  public showCancelVisitPopup(visitIndex: number): void {
    this.selectedVisit = this.visits[visitIndex];
    this.cancelVisitPopup.show();
  }

  private fillVisitsArray(visitsFromResponse: Visit[]): void {
    for (let i = 0; i < visitsFromResponse.length; i++) {
      this.visits.push({
        index: i,
        id: visitsFromResponse[i].id,
        visitTypeName: visitsFromResponse[i].visitTypeName,
        status: visitsFromResponse[i].visitStatus,
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

  private getCancelMessageBasedOnLoggedUser(): string {
    if (this.patientLoggedIn) {
      return 'Wizyta anulowana przez pacjenta';
    } else {
      return 'Wizyta anulowana przez pracownika';
    }
  }
}
