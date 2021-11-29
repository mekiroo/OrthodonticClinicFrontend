import {Injectable} from '@angular/core';
import {CreatePatientRequest} from '../payload/create-patient.request';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {GlobalConstants} from '../../_constants/global-constants';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  constructor(private http: HttpClient) {
  }

  public register(createPatientRequest: CreatePatientRequest): Observable<any> {
    return this.http.post(GlobalConstants.apiUrl + '/patients', createPatientRequest, GlobalConstants.httpOptions);
  }
}
