import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CookieHelperService } from './cookie-helper.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  headers = new HttpHeaders();

  constructor(private http: HttpClient, private cookie: CookieHelperService) { }

  login(username: string, password: string): Observable<Object>{
    console.log(`Sending request to ${environment.apiURL}/auth/login`)
    return this.http.post(`${environment.apiURL}/auth/login`,{
      userid: username,
      password: password
    }, { responseType: 'json'});
  }

  async changePassword() {
    
  }

  isLoggedIn() {
    return this.cookie.getPresenceToken() !== "";
  }

  logout() {
    this.cookie.deleteToken();
  }

  isAuthorized(auth: string[]) {
    this.headers = this.setAuthHeader(); 
    return this.http.post(
      `${environment.apiURL}/auth/`, 
      {
        authorization: auth
      },
      {
        headers: this.headers,
        observe: 'response'
      }
    );
  }

  setAuthHeader() {
    if (!this.headers.has('Authorization')) {
      this.headers = this.headers.set('Authorization', `Bearer ${this.cookie.getPresenceToken()}`);
    }
    return this.headers;
  }

  deleteHeaders() {
    if (this.headers.has('Authorization')) {
      this.headers = this.headers.delete('Authorization');
    }
    return this.headers;
  }

  
}
