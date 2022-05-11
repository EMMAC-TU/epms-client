import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeCreationComponent } from './employee-creation/employee-creation.component';
import { AdminGuard } from './guard/admin.guard';
import { AuthGuard } from './guard/auth.guard';
import { HomePageComponent } from './home-page/home-page.component';
import { LoginComponent } from './login/login.component';
import { SearchEmployeeComponent } from './search-employee/search-employee.component';
import { OptionsComponent } from './options/options.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { PatientCreationComponent } from './patient-creation/patient-creation.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    component: HomePageComponent,
    canActivate: [ AuthGuard ]
  },
  {
    path: 'search-employee',
    component: SearchEmployeeComponent
  },
  {
    path: 'create-employee',
    component: EmployeeCreationComponent,
    canActivate: [ AuthGuard, AdminGuard ]
  },
  {
    path: 'create-patient',
    component: PatientCreationComponent,
    canActivate: [ AuthGuard, ]
  },
  {
    path: 'options',
    component: OptionsComponent,
    canActivate: [ AuthGuard ]
  },
  {
    path: '**', pathMatch: 'full',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
