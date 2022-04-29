import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeCreationComponent } from './employee-creation/employee-creation.component';
import { AuthGuard } from './guard/auth.guard';
import { HomePageComponent } from './home-page/home-page.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    //canActivate: [ AuthGuard ]
  },
  {
    path: '',
    component: HomePageComponent
  },
  {
    path: 'create-employee',
    component: EmployeeCreationComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
