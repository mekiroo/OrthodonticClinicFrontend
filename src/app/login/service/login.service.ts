import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {GlobalConstants} from '../../_constants/global-constants';
import {LoginRequest} from '../payload/login.request';
import {JwtResponse} from '../payload/jwt.response';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) {
  }

  public login(loginRequest: LoginRequest): Observable<JwtResponse> {
    return this.http.post<JwtResponse>(GlobalConstants.apiUrl + '/login', loginRequest, GlobalConstants.httpOptions);
  }
}
