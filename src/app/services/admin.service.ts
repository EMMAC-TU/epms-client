import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BackendQuery } from '../types/BackendQuery';
import { Employee } from '../types/Employee';
import { EmployeeCreation } from '../types/EmployeeCreation';
import { AuthService } from './auth.service';
import { CookieHelperService } from './cookie-helper.service';

/**
 * Class representing the "Admin Service"
 */
@Injectable({
  providedIn: 'root'
})
export class AdminService {
  headers: HttpHeaders = new HttpHeaders();

  constructor(private http: HttpClient, private auth: AuthService) { }

  /**
   * Function to handle sending the request to create a new employee
   * @param {EmployeeCreation} newEmployee The object with the information for the employee
   * @returns The response from the back end
   */
  createEmployee(newEmployee: EmployeeCreation): Observable<Object> {
    this.headers = this.auth.setAuthHeader();
    return this.http.post(`${environment.apiURL}/employees`, newEmployee, {
      headers: this.headers,
      observe: 'response'
    });
  }

  /**
   * Function to handle sending the request to search for a new employee
   * @param {BackendQuery} backendQuery The BackendQuery object with the information for the query
   * @returns The response from the back end
   */
  searchEmployees(backendQuery: BackendQuery) {
    let query = [];

    if (backendQuery.dob) query.push(`dateofbirth=${backendQuery.dob}`);
    if (backendQuery.lastname) query.push(`lastname=${backendQuery.lastname}`);
    if (backendQuery.employeeid) query.push(`employeeid=${backendQuery.employeeid}`);
    if (backendQuery.limit) query.push(`limit=${backendQuery.limit}`);
    if (backendQuery.page) query.push(`page=${backendQuery.page}`);
    if (backendQuery.sort) query.push(`sort=${backendQuery.sort}`);

    this.headers = this.auth.setAuthHeader();
    return this.http.get(`${environment.apiURL}/employees/search?${query.join('&')}`, {
      headers: this.headers,
      observe: 'response'
    });
  }

  /**
   * Function to handle sending the request to get an employee record
   * @param {string} employeeid The employeeid for the employee of the record to get
   * @returns The response from the back end
   */
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

/**
 * Function to handle sending the request to update an employee record
 * @param employeeid The employeeid of the employee to update
 * @param employee The updated employee data
 * @returns The response from the back end
 */
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
