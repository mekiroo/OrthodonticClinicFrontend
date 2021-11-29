import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomePageComponent} from './home-page/home-page.component';
import {RegistrationComponent} from './registration/component/registration.component';
import {LoginComponent} from './login/component/login.component';
import {CreateVisitComponent} from './visit/component/create-visit/create-visit.component';
import {ShowWaitingVisitsComponent} from './visit/component/show-waiting-visits/show-waiting-visits.component';
import {ShowVisitsHistoryComponent} from './visit/component/show-visits-history/show-visits-history.component';
import {ShowPatientsComponent} from './patient/component/show-patients/show-patients.component';
import {ShowTodaysEmployeeVisitsComponent} from './visit/component/show-todays-employee-visits/show-todays-employee-visits.component';
import {CreateEmployeeComponent} from './employee/component/create-employee/create-employee.component';
import {EmployeeGuard} from './_security/guard/employee-guard.service';
import {AuthGuard} from './_security/guard/auth-guard.service';
import {AdminGuard} from './_security/guard/admin-guard.service';

const routes: Routes = [
  {path: '', component: HomePageComponent},
  {path: 'register', component: RegistrationComponent},
  {path: 'login', component: LoginComponent},
  {path: 'create-visit', canActivate: [AuthGuard], component: CreateVisitComponent},
  {path: 'waiting-visits', canActivate: [AuthGuard], component: ShowWaitingVisitsComponent},
  {path: 'visits-history', canActivate: [AuthGuard], component: ShowVisitsHistoryComponent},
  {path: 'patients', canActivate: [EmployeeGuard], component: ShowPatientsComponent},
  {path: 'todays-visits', canActivate: [EmployeeGuard], component: ShowTodaysEmployeeVisitsComponent},
  {path: 'create-employee', canActivate: [AdminGuard], component: CreateEmployeeComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
