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

  changePassword(currPassword: string, newPassword: string, employeeid?: string): Observable<Object>{
    this.headers = this.setAuthHeader(); 
    const req = {
      password: employeeid ? undefined : currPassword, // password not needed if admin is updating a password
      newpassword: newPassword,
      employeeid: employeeid ? employeeid : undefined
    };
    return this.http.patch(
      `${environment.apiURL}/auth/password`,
      req,
      {
        headers: this.headers,
        observe: 'response'
      });
  }

  checkCookieHeader() {
    let cookieHeader = this.headers.get('Cookie');
    console.log(`Cookie Header: ${cookieHeader}`)
    if (!cookieHeader) {
      return false;
    }

    if (!cookieHeader.startsWith('presence')) {
      return false;
    }

    cookieHeader = cookieHeader.substring('presence'.length, cookieHeader.length);
    console.log(`cookieheader is: ${cookieHeader}`);
    this.cookie.createPresenceToken(cookieHeader);
    return true;
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
    let cookie = this.cookie.getPresenceToken()
    if (!this.headers.has('Authorization')) {
      if (!cookie) {
        this.checkCookieHeader();
        cookie = this.cookie.getPresenceToken();
      }
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
