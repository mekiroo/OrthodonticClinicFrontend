import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Employee} from '../model/employee.model';
import {GlobalConstants} from '../../_constants/global-constants';
import {CreateEmployeeRequest} from '../payload/create-employee.request';
import {AuthService} from '../../_security/service/auth.service';
import {Position} from '../model/position.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private http: HttpClient) {
  }

  public getEmployeesByPositionId(positionId: number): Observable<Employee[]> {
    return this.http.get<Employee[]>(GlobalConstants.apiUrl + '/employees?positionId=' + positionId, AuthService.getAuthorizedHttpOptions());
  }

  public createEmployee(createEmployeeRequest: CreateEmployeeRequest): Observable<Employee> {
    return this.http.post<Employee>(GlobalConstants.apiUrl + '/employees', createEmployeeRequest, AuthService.getAuthorizedHttpOptions());
  }

  public getEmployeePositions(): Observable<Position[]> {
    return this.http.get<Position[]>(GlobalConstants.apiUrl + '/positions', AuthService.getAuthorizedHttpOptions());
  }
}
