import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { EmployeeCreation } from '../types/EmployeeCreation';
import { CookieHelperService } from './cookie-helper.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  headers: HttpHeaders = new HttpHeaders();
  constructor(private http: HttpClient, private cookies: CookieHelperService) { }

  createEmployee(newEmployee: EmployeeCreation): Observable<Object> {
    this.headers = this.headers.set('Authorization', this.cookies.getPresenceToken());
    return this.http.post(`${environment.apiURL}/employees`, newEmployee, {
      headers: this.headers,
      observe: 'response'
    });
  }

  searchEmployees() {

  }

  getEmployee() {

  }

  updateEmployee() {
    
  }
}
