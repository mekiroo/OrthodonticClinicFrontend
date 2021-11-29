import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {VisitType} from './visit-type.model';
import {GlobalConstants} from '../_constants/global-constants';
import {AuthService} from '../_security/service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class VisitTypeService {

  constructor(private http: HttpClient) {
  }

  public getVisitTypes(): Observable<VisitType[]> {
    return this.http.get<VisitType[]>(GlobalConstants.apiUrl + '/visit-types', AuthService.getAuthorizedHttpOptions());
  }
}
