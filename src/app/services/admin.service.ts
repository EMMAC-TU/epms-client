import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BackendQuery } from '../types/BackendQuery';
import { Employee } from '../types/Employee';
import { EmployeeCreation } from '../types/EmployeeCreation';
import { AuthService } from './auth.service';
import { CookieHelperService } from './cookie-helper.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  headers: HttpHeaders = new HttpHeaders();

  constructor(private http: HttpClient, private auth: AuthService) { }

  createEmployee(newEmployee: EmployeeCreation): Observable<Object> {
    this.headers = this.auth.setAuthHeader();
    return this.http.post(`${environment.apiURL}/employees`, newEmployee, {
      headers: this.headers,
      observe: 'response'
    });
  }

  searchEmployees(backendQuery: BackendQuery) {
    let query = [];

    if (backendQuery.dob) query.push(`dateofbirth=${backendQuery.dob}`);
    if (backendQuery.lastname) query.push(`lastname=${backendQuery.lastname}`);
    if (backendQuery.employeeid) query.push(`employeeid=${backendQuery.employeeid}`);
    if (backendQuery.limit) query.push(`limit=${backendQuery.limit}`);
    if (backendQuery.page) query.push(`page=${backendQuery.page}`);

    this.headers = this.auth.setAuthHeader();
    return this.http.get(`${environment.apiURL}/employees/search?${query.join('&')}`, {
      headers: this.headers,
      observe: 'response'
    });
  }

  getEmployee(employeeid: string) {
    this.headers = this.auth.setAuthHeader();
    return this.http.get(
      `${environment.apiURL}/employees/${employeeid}`,
      {
        headers: this.headers,
        observe: 'response'
      }
    );
  }

  updateEmployee(employeeid: string | undefined, employee: Partial<Employee>) {
    this.headers = this.auth.setAuthHeader();
    return this.http.patch(
      `${environment.apiURL}/employees/${employeeid}`,
      employee,
      {
        headers: this.headers,
        observe: 'response'
      }
    );
  }

}
