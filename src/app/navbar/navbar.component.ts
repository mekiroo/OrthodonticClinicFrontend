import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {AuthService} from '../_security/service/auth.service';
import {Router} from '@angular/router';
import {GlobalConstants} from '../_constants/global-constants';
import {EUserRole} from '../_security/model/user-role.model';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  public isMenuCollapsed = true;
  public userLoggedIn = false;
  public patientLoggedIn = false;
  public employeeLoggedIn = false;
  public adminLoggedIn = false;

  private authServiceSubscription: Subscription;

  constructor(private router: Router, private authService: AuthService) {
  }

  ngOnInit(): void {
    this.updateNavbar();
    this.authServiceSubscription = this.authService.userLoggedIn.subscribe(userLoggedIn => {
      this.updateNavbar();
    });
  }

  private updateNavbar(): void {
    const user = this.authService.getUser();
    this.userLoggedIn = false;
    this.patientLoggedIn = false;
    this.employeeLoggedIn = false;
    this.adminLoggedIn = false;

    if (user !== null) {
      const role = this.authService.getUser().role;
      this.userLoggedIn = true;

      if (role === EUserRole.PATIENT) {
        this.patientLoggedIn = true;
      } else if (role === EUserRole.EMPLOYEE) {
        this.employeeLoggedIn = true;
      } else if (role === EUserRole.ADMIN) {
        this.adminLoggedIn = true;
      }
    }
  }

  ngOnDestroy(): void {
    this.authServiceSubscription.unsubscribe();
  }

  public onLogOut(): void {
    this.authService.logOut();
    // Navigate to home page:
    this.router.navigate(['/']);
  }

  public getLoggedUserFullName(): string {
    const firstName = this.authService.getUser().firstName;
    const lastName = this.authService.getUser().lastName;
    return firstName + ' ' + lastName;
  }

  public navigateToVisitsHistory(): void {
    const patient = this.getPatientDataFromAuthService();
    window.sessionStorage.setItem(GlobalConstants.SELECTED_PATIENT, JSON.stringify(patient));
    this.router.navigate(['visits-history']);
  }

  public navigateToCreateVisit(): void {
    const patient = this.getPatientDataFromAuthService();
    window.sessionStorage.setItem(GlobalConstants.SELECTED_PATIENT, JSON.stringify(patient));
    this.router.navigate(['create-visit']);
  }

  private getPatientDataFromAuthService(): { id: number, fullName: string } {
    const patientFullName = this.authService.getUser().firstName + ' ' + this.authService.getUser().lastName;
    const patientId = this.authService.getUser().userId;
    return {
      id: patientId,
      fullName: patientFullName
    };
  }
}
