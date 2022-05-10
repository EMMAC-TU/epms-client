import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Patient } from '../types/Patient';
import { PatientCreation } from '../types/PatientCreation';
import { AuthService } from './auth.service';

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

  searchPatient() {

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
