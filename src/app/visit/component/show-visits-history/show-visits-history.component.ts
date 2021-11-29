import {AfterViewInit, ChangeDetectorRef, Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {MdbTableDirective, MdbTablePaginationComponent, ModalDirective} from 'angular-bootstrap-md';
import {VisitService} from '../../service/visit.service';
import {EVisitStatus} from '../../model/visit-status.model';
import {Visit} from '../../model/visit.model';
import {GlobalConstants} from '../../../_constants/global-constants';
import {EVisitStatusPolish} from '../../model/visit-status-polish.model';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {EditVisitRequest} from '../../payload/edit-visit.request';
import {AuthService} from '../../../_security/service/auth.service';
import {EUserRole} from '../../../_security/model/user-role.model';

@Component({
  selector: 'app-show-visits-history',
  templateUrl: './show-visits-history.component.html',
  styleUrls: ['./show-visits-history.component.css']
})
export class ShowVisitsHistoryComponent implements OnInit, AfterViewInit {
  @ViewChild(MdbTablePaginationComponent, {static: true}) mdbTablePagination: MdbTablePaginationComponent;
  @ViewChild(MdbTableDirective, {static: true}) mdbTable: MdbTableDirective;
  @ViewChild('visitDetails', {static: true}) visitDetailsPopup: ModalDirective;
  @ViewChild('editVisitPopup', {static: true}) editVisitPopup: ModalDirective;
  visits: any = [];
  previous: any = [];
  patientFullName: string;
  patientId: number;
  searchText = '';
  selectedVisit: any;
  requestSending = false;
  loadCanceledVisits = true;
  editVisitForm: FormGroup;
  employeeLoggedIn = false;
  employeeLoggedInFullName: string;

  constructor(private visitService: VisitService, private authService: AuthService, private cdRef: ChangeDetectorRef) {
  }

  public ngOnInit(): void {
    const patient = JSON.parse(window.sessionStorage.getItem(GlobalConstants.SELECTED_PATIENT));
    this.patientId = patient.id;
    this.patientFullName = patient.fullName;
    this.getPatientVisitsByStatus(EVisitStatus.COMPLETED);
    if (this.authService.getUser().role === EUserRole.EMPLOYEE) {
      this.employeeLoggedIn = true;
      this.employeeLoggedInFullName = this.authService.getUser().firstName + ' ' + this.authService.getUser().lastName;
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

  public getPatientVisitsByStatus(visitStatus: EVisitStatus): void {
    this.requestSending = true;
    this.visitService.getPatientVisitByVisitStatus(this.patientId, visitStatus).subscribe(response => {
      this.visits = [];
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

  public updateTableWithVisits(): void {
    if (this.loadCanceledVisits) {
      this.getPatientVisitsByStatus(EVisitStatus.CANCELED);
      this.loadCanceledVisits = false;
    } else {
      this.getPatientVisitsByStatus(EVisitStatus.COMPLETED);
      this.loadCanceledVisits = true;
    }
    this.searchText = '';
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

  public showVisitDetailsPopup(visitIndex: number): void {
    this.selectedVisit = this.visits[visitIndex];
    this.visitDetailsPopup.show();
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

  public showEditVisitPopup(visitIndex: number): void {
    this.editVisitPopup.show();
    this.selectedVisit = this.visits[visitIndex];
    this.loadEditVisitForm();
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
      if (!this.loadCanceledVisits) {
        this.getPatientVisitsByStatus(EVisitStatus.CANCELED);
      } else {
        this.getPatientVisitsByStatus(EVisitStatus.COMPLETED);
      }
      this.requestSending = false;
    }, error => {
      console.log(error);
      this.requestSending = false;
    });
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

  private convertVisitStatus(status: string): string {
    if (status === EVisitStatusPolish.WAITING) {
      return EVisitStatus.WAITING;
    } else if (status === EVisitStatusPolish.COMPLETED) {
      return EVisitStatus.COMPLETED;
    } else if (status === EVisitStatusPolish.CANCELED) {
      return EVisitStatus.CANCELED;
    }
  }
}
