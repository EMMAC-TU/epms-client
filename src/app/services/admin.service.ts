import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Employee } from '../types/Employee';
import { EmployeeCreation } from '../types/EmployeeCreation';
import { CookieHelperService } from './cookie-helper.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  headers: HttpHeaders = new HttpHeaders();
  constructor(private http: HttpClient, private cookies: CookieHelperService) { }

  createEmployee(newEmployee: EmployeeCreation): Observable<Object> {
    this.setAuthHeader();
    return this.http.post(`${environment.apiURL}/employees`, newEmployee, {
      headers: this.headers,
      observe: 'response'
    });
  }

  searchEmployees(params: {
    dob?: string,
    lastname?: string,
    employeeid?: string,
    limit?: number,
    page?: number
  }) {
    let query = [];

    if (params.dob) query.push(`dateofbirth=${params.dob}`);
    if (params.lastname) query.push(`lastname=${params.lastname}`);
    if (params.employeeid) query.push(`employeeid=${params.employeeid}`);
    if (params.limit) query.push(`limit=${params.limit}`);
    if (params.page) query.push(`page=${params.page}`);

    this.setAuthHeader();
    return this.http.get(`${environment.apiURL}/employees/search?${query.join('&')}`, {
      headers: this.headers,
      observe: 'response'
    });
  }

  getEmployee(employeeid: string) {
    this.setAuthHeader();
    return this.http.get(
      `${environment.apiURL}/employees/${employeeid}`,
      {
        headers: this.headers,
        observe: 'response'
      }
    );
  }

  updateEmployee(employeeid: string, employee: Partial<Employee>) {
    this.setAuthHeader();
    return this.http.patch(
      `${environment.apiURL}/employee/${employeeid}`,
      employee,
      {
        headers: this.headers,
        observe: 'response'
      }
    );
  }

  setAuthHeader() {
    if (!this.headers.has('Authorization')) {
      this.headers = this.headers.set('Authorization', `Bearer ${this.cookies.getPresenceToken()}`);
    }
  }
}
