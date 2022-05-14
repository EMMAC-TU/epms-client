import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Patient } from '../types/Patient';
import { PatientCreation } from '../types/PatientCreation';
import { AuthService } from './auth.service';
import { BackendQuery } from '../types/BackendQuery';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  headers = new HttpHeaders();
  constructor(
    private http: HttpClient, 
    private auth: AuthService) {
  }

  createPatient(newPatient: PatientCreation): Observable<Object> {
    this.headers = this.auth.setAuthHeader();
    return this.http.post(
      `${environment.apiURL}/patients`, 
      newPatient, 
      { observe: "response", headers: this.headers });
  }

  updatePatient(patientid: string | undefined, updatedPatient: Partial<Patient>) {
    this.headers = this.auth.setAuthHeader();
    return this.http.patch(
      `${environment.apiURL}/patients/${patientid}`,
      updatedPatient,
      {
        headers: this.headers,
        observe: 'response'
      }
    );
  }

  searchPatients(backendQuery: BackendQuery) {
    let query = [];

    if (backendQuery.dob) query.push(`dateofbirth=${backendQuery.dob}`);
    if (backendQuery.lastname) query.push(`lastname=${backendQuery.lastname}`);
    if (backendQuery.patientid) query.push(`patientid=${backendQuery.patientid}`);
    if (backendQuery.limit) query.push(`limit=${backendQuery.limit}`);
    if (backendQuery.page) query.push(`page=${backendQuery.page}`);
    if (backendQuery.sort) query.push(`sort=${backendQuery.sort}`);

    this.headers = this.auth.setAuthHeader();
    return this.http.get(`${environment.apiURL}/patients/search?${query.join('&')}`, {
      headers: this.headers,
      observe: 'response'
    });
  }

  getAPatient(patientid: string) {
    this.headers = this.auth.setAuthHeader();
    return this.http.get<Patient>(
      `${environment.apiURL}/patients/${patientid}`,
      {
        headers: this.headers,
        observe: 'response'
      }
    );
  }

}
