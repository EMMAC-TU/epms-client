import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PatientCreation } from '../types/PatientCreation';
import { CookieHelperService } from './cookie-helper.service';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  headers = new HttpHeaders();
  constructor(private http: HttpClient, private cookie: CookieHelperService) {
  }

  createPatient(newPatient: PatientCreation): Observable<Object> {
    this.headers = this.headers.set('Authorization', `Bearer ${this.cookie.getPresenceToken()}`);
    return this.http.post(
      `${environment.apiURL}/patients`, 
      newPatient, 
      { observe: "response", headers: this.headers });
  }

  updatePatient() {

  }

  searchPatient() {

  }

  getAPatient() {

  }

}
