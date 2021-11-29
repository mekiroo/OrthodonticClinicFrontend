import {AfterViewInit, ChangeDetectorRef, Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {MdbTableDirective, MdbTablePaginationComponent, ModalDirective} from 'angular-bootstrap-md';
import {PatientService} from '../../service/patient.service';
import {Patient} from '../../model/patient.model';
import {Router} from '@angular/router';
import {GlobalConstants} from '../../../_constants/global-constants';

@Component({
  selector: 'app-show-patients',
  templateUrl: './show-patients.component.html',
  styleUrls: ['./show-patients.component.css']
})
export class ShowPatientsComponent implements OnInit, AfterViewInit {
  @ViewChild(MdbTablePaginationComponent, {static: true}) mdbTablePagination: MdbTablePaginationComponent;
  @ViewChild(MdbTableDirective, {static: true}) mdbTable: MdbTableDirective;
  @ViewChild('basicModal', {static: true}) cancelPopup: ModalDirective;
  patients: any = [];
  previous: any = [];
  searchText = '';
  requestSending = false;

  constructor(private patientService: PatientService, private router: Router, private cdRef: ChangeDetectorRef) {
  }

  public ngOnInit(): void {
    this.getPatients();
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

  public getPatients(): void {
    this.requestSending = true;
    this.patientService.getPatients().subscribe(response => {
      this.fillPatientsArray(response);
      this.convertPhoneNumberInPatientsArray();
      this.updatePaginationTable();
      setTimeout(() => {
        this.requestSending = false;
      }, 200);
    }, error => {
      console.log(error);
      this.requestSending = false;
    });
  }

  public updatePaginationTable(): void {
    this.mdbTable.setDataSource(this.patients);
    this.patients = this.mdbTable.getDataSource();
    this.previous = this.mdbTable.getDataSource();
  }

  public searchItems(): void {
    const prev = this.mdbTable.getDataSource();
    if (!this.searchText) {
      this.mdbTable.setDataSource(this.previous);
      this.patients = this.mdbTable.getDataSource();
    }
    if (this.searchText) {
      this.patients = this.mdbTable.searchLocalDataBy(this.searchText);
      this.mdbTable.setDataSource(prev);
    }
  }

  public navigateToPatientVisitsHistory(patientIndex: number): void {
    this.setSelectedPatient(patientIndex);
    this.router.navigate(['visits-history']);
  }

  public navigateToCreateVisit(patientIndex: number): void {
    this.setSelectedPatient(patientIndex);
    this.router.navigate(['create-visit']);
  }

  private setSelectedPatient(patientIndex: number): void {
    const selectedPatient = this.patients[patientIndex];
    const patient = {
      id: selectedPatient.id,
      fullName: selectedPatient.patientFullName
    };
    window.sessionStorage.setItem(GlobalConstants.SELECTED_PATIENT, JSON.stringify(patient));
  }

  private fillPatientsArray(patientsFromResponse: Patient[]): void {
    for (let i = 0; i < patientsFromResponse.length; i++) {
      this.patients.push({
        index: i,
        id: patientsFromResponse[i].id,
        patientFullName: patientsFromResponse[i].firstName + ' ' + patientsFromResponse[i].lastName,
        pesel: patientsFromResponse[i].pesel,
        email: patientsFromResponse[i].email,
        phoneNumber: patientsFromResponse[i].phoneNumber
      });
    }
  }

  private convertPhoneNumberInPatientsArray(): void {
    for (const patient of this.patients) {
      patient.phoneNumber = patient.phoneNumber.slice(0, 3) + ' ' + patient.phoneNumber.slice(3, 6) + ' '
        + patient.phoneNumber.slice(6, 9);
    }
  }
}
