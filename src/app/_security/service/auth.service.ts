import {Injectable} from '@angular/core';
import {GlobalConstants} from '../../_constants/global-constants';
import {User} from '../model/user.model';

import jwt_decode from 'jwt-decode';
import {Subject} from 'rxjs';
import {HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() {
  }

  userLoggedIn = new Subject<boolean>();

  public static getJwt(): string | null {
    return window.sessionStorage.getItem(GlobalConstants.JWT_KEY);
  }

  public static getAuthorizedHttpOptions(): { headers: HttpHeaders } {
    const jwt = AuthService.getJwt();

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + jwt
      })
    };
    return httpOptions;
  }

  public logOut(): void {
    window.sessionStorage.clear();
    this.userLoggedIn.next(false);
  }

  public saveJwt(jwt: string): void {
    window.sessionStorage.removeItem(GlobalConstants.JWT_KEY);
    window.sessionStorage.setItem(GlobalConstants.JWT_KEY, jwt);
  }

  public getUser(): User | null {
    const user = window.sessionStorage.getItem(GlobalConstants.USER_KEY);
    if (user) {
      return JSON.parse(user);
    }
    return null;
  }

  public isEmployeeLoggedIn(): Promise<boolean> {
    return new Promise(
      (resole, reject) => {
        setTimeout(() => {
          resole(this.getUser().role === 'EMPLOYEE');
        }, 100);
      }
    );
  }

  public saveUser(user: User): void {
    window.sessionStorage.removeItem(GlobalConstants.USER_KEY);
    window.sessionStorage.setItem(GlobalConstants.USER_KEY, JSON.stringify(user));
    this.userLoggedIn.next(true);
  }

  public getUserFromJwt(jwt: string): User {
    const jwtPayload = jwt_decode(jwt);

    const user: User = {
      username: jwtPayload['sub'],
      userId: jwtPayload['user_id'],
      firstName: jwtPayload['first_name'],
      lastName: jwtPayload['last_name'],
      role: jwtPayload['role']
    };
    return user;
  }
}
