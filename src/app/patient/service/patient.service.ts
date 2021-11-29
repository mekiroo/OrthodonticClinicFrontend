import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Patient} from '../model/patient.model';
import {GlobalConstants} from '../../_constants/global-constants';
import {AuthService} from '../../_security/service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  constructor(private http: HttpClient) {
  }

  public getPatients(): Observable<Patient[]> {
    return this.http.get<Patient[]>(GlobalConstants.apiUrl + '/patients', AuthService.getAuthorizedHttpOptions());
  }
}
