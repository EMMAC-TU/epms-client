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

  constructor(
    private http: HttpClient, 
    private cookie: CookieHelperService) { }

  login(username: string, password: string): Observable<Object>{
    return this.http.post(`${environment.apiURL}/auth/login`,{
      userid: username,
      password: password
    }, { responseType: 'json'});
  }

  changePassword(currPassword: string, newPassword: string): Observable<Object>{
    this.headers = this.setAuthHeader(); 
    console.log(`Current: ${currPassword}  new: ${newPassword}`)
    return this.http.patch(
      `${environment.apiURL}/auth/password`,
      {
        password: currPassword,
        newpassword: newPassword
      },
      {
        headers: this.headers,
        observe: 'response'
      });
  }

  isLoggedIn() {
    return this.cookie.getPresenceToken() !== "";
  }

  logout() {
    this.cookie.deleteToken();
    this.deleteHeaders();
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
    let cookie = this.cookie.getPresenceToken();
    if (!this.headers.has('Authorization')) {
      this.headers = this.headers.set('Authorization', `Bearer ${cookie}`);
    }
    return this.headers;
  }

  private deleteHeaders() {
    if (this.headers.has('Authorization')) {
      this.headers = this.headers.delete('Authorization');
    }
    return this.headers;
  }

  
}
