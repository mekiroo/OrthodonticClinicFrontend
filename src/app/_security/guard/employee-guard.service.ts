import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from '../service/auth.service';

@Injectable()
export class EmployeeGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const loggedUser = this.authService.getUser();
    if (loggedUser !== null && loggedUser.role === 'EMPLOYEE') {
      return true;
    } else {
      this.router.navigate(['/']);
    }
  }
}
