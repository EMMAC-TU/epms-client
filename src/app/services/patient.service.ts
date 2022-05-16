import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Patient } from '../types/Patient';
import { PatientCreation } from '../types/PatientCreation';
import { AuthService } from './auth.service';
import { BackendQuery } from '../types/BackendQuery';

/**
 * Class representing the "Patient Service"
 */
@Injectable({
  providedIn: 'root'
})
export class PatientService {
  headers = new HttpHeaders();
  constructor(
    private http: HttpClient, 
    private auth: AuthService) {
  }

  /**
   * Function to handle sending the request to create a new patient
   * @param {PatientCreation} newPatient The object with the information for the patient
   * @returns The response from the back end
   */
  createPatient(newPatient: PatientCreation): Observable<Object> {
    this.headers = this.auth.setAuthHeader();
    return this.http.post(
      `${environment.apiURL}/patients`, 
      newPatient, 
      { observe: "response", headers: this.headers });
  }

  /**
  * Function to handle sending the request to update an patient record
  * @param patientid The patientid of the patient to update
  * @param updatedPatient The updated patient data
  * @returns The response from the back end
  */
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

  /**
  * Function to handle sending the request to search for a new patient
  * @param {BackendQuery} backendQuery The BackendQuery object with the information for the query
  * @returns The response from the back end
  */
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

  /**
  * Function to handle sending the request to get a patient record
  * @param {string} patientid The patientid for the patient of the record to get
  * @returns The response from the back end
  */
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
