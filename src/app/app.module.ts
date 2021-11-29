import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {MDBBootstrapModule} from 'angular-bootstrap-md';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NavbarComponent} from './navbar/navbar.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {HomePageComponent} from './home-page/home-page.component';
import {RegistrationComponent} from './registration/component/registration.component';
import {LoginComponent} from './login/component/login.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {ToastrModule} from 'ngx-toastr';
import {CreateVisitComponent} from './visit/component/create-visit/create-visit.component';
import {ShowWaitingVisitsComponent} from './visit/component/show-waiting-visits/show-waiting-visits.component';
import {ShowVisitsHistoryComponent} from './visit/component/show-visits-history/show-visits-history.component';
import {ShowPatientsComponent} from './patient/component/show-patients/show-patients.component';
import {ShowTodaysEmployeeVisitsComponent} from './visit/component/show-todays-employee-visits/show-todays-employee-visits.component';
import {CreateEmployeeComponent} from './employee/component/create-employee/create-employee.component';
import {EmployeeGuard} from './_security/guard/employee-guard.service';
import {AuthGuard} from './_security/guard/auth-guard.service';
import {AdminGuard} from './_security/guard/admin-guard.service';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomePageComponent,
    RegistrationComponent,
    LoginComponent,
    CreateVisitComponent,
    ShowWaitingVisitsComponent,
    ShowVisitsHistoryComponent,
    ShowPatientsComponent,
    ShowTodaysEmployeeVisitsComponent,
    CreateEmployeeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    MDBBootstrapModule.forRoot(),
    BrowserAnimationsModule,
    NgbModule,
    FormsModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right'
    })
  ],
  providers: [AuthGuard, EmployeeGuard, AdminGuard],
  bootstrap: [AppComponent]
})
export class AppModule {
}
