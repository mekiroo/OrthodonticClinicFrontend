import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {VisitTime} from '../model/visit-time.model';
import {GlobalConstants} from '../../_constants/global-constants';
import {CreateVisitRequest} from '../component/create-visit/payload/create-visit.request';
import {Visit} from '../model/visit.model';
import {EVisitStatus} from '../model/visit-status.model';
import {EditVisitRequest} from '../payload/edit-visit.request';
import {AuthService} from '../../_security/service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class VisitService {

  constructor(private http: HttpClient) {
  }

  public getPossibleVisitTimes(employeeId: number, patientId: number, visitTypeId: number, date: string): Observable<VisitTime[]> {
    const url = GlobalConstants.apiUrl + '/visits/possible-visit-times?employeeId=' + employeeId + '&patientId=' + patientId
      + '&visitTypeId=' + visitTypeId + '&date=' + date;
    return this.http.get<VisitTime[]>(url, AuthService.getAuthorizedHttpOptions());
  }

  public createVisit(createVisitRequest: CreateVisitRequest): Observable<Visit> {
    const url = GlobalConstants.apiUrl + '/patients/' + createVisitRequest.patientId + '/visits';
    return this.http.post<Visit>(url, createVisitRequest, AuthService.getAuthorizedHttpOptions());
  }

  public getPatientVisitByVisitStatus(patientId: number, visitStatus: EVisitStatus): Observable<Visit[]> {
    const url = GlobalConstants.apiUrl + '/patients/' + patientId + '/visits?visitStatus=' + visitStatus;
    return this.http.get<Visit[]>(url, AuthService.getAuthorizedHttpOptions());
  }

  public getEmployeeVisitsByVisitStatus(employeeId: number, visitStatus: EVisitStatus): Observable<Visit[]> {
    const url = GlobalConstants.apiUrl + '/employees/' + employeeId + '/visits?visitStatus=' + visitStatus;
    return this.http.get<Visit[]>(url, AuthService.getAuthorizedHttpOptions());
  }

  public getEmployeeVisitsByDate(employeeId: number, date: string): Observable<Visit[]> {
    const url = GlobalConstants.apiUrl + '/employees/' + employeeId + '/visits?date=' + date;
    return this.http.get<Visit[]>(url, AuthService.getAuthorizedHttpOptions());
  }

  public editVisit(patientId: number, visitId: number, editVisitRequest: EditVisitRequest): Observable<Visit> {
    const url = GlobalConstants.apiUrl + '/patients/' + patientId + '/visits/' + visitId;
    return this.http.put<Visit>(url, editVisitRequest, AuthService.getAuthorizedHttpOptions());
  }
}
