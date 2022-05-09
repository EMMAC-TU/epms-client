import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeCreationComponent } from './employee-creation/employee-creation.component';
import { AdminGuard } from './guard/admin.guard';
import { AuthGuard } from './guard/auth.guard';
import { HomePageComponent } from './home-page/home-page.component';
import { LoginComponent } from './login/login.component';
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
    path: '**',
    redirectTo: '/login'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
