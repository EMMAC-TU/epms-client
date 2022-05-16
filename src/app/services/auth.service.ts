import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CookieHelperService } from './cookie-helper.service';

/**
 * Class representing the "Auth Service"
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  headers = new HttpHeaders();

  constructor(
    private http: HttpClient, 
    private cookie: CookieHelperService) { }

  /**
   * Function to handle sending the login request to the backend
   * @param {string} username The username to use to login
   * @param {string} password The password to use to login
   * @returns The response from the back end
   */
  login(username: string, password: string): Observable<Object>{
    return this.http.post(`${environment.apiURL}/auth/login`,{
      userid: username,
      password: password
    }, { responseType: 'json'});
  }

  /**
   * Function to handle sending the change password request to the backend
   * @param {string} currPassword The current password
   * @param {string} newPassword The new password
   * @param {string} employeeid The employeeid of the employee whose password should be updated
   * @returns The response from the back end
   */
  changePassword(currPassword: string, newPassword: string, employeeid?: string): Observable<Object>{
    this.headers = this.setAuthHeader(); 
    const req = {
      password: employeeid ? undefined : currPassword, // currPassword not needed if admin is updating a password
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

  /**
   * Function to determine if a user is logged in
   * @returns {boolean} Whether or not the user is currently logged in
   */
  isLoggedIn() {
    return this.cookie.getPresenceToken() !== "";
  }

  /**
   * Function to logout the user
   */
  logout() {
    this.cookie.deleteToken();
    this.deleteHeaders();
  }

  /**
   * Function to determine if a user is authorized
   * @param {string[]} auth The list of user types that are authorized
   * @returns The response from the back end
   */
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

  /**
   * Function to set the authorization header for an requests to the backend
   * @returns The updated header
   */
  setAuthHeader() {
    let cookie = this.cookie.getPresenceToken();
    if (!this.headers.has('Authorization')) {
      this.headers = this.headers.set('Authorization', `Bearer ${cookie}`);
    }
    return this.headers;
  }

  /**
   * Function to delete the authorization header for requests to the backend
   * @returns The updated header
   */
  private deleteHeaders() {
    if (this.headers.has('Authorization')) {
      this.headers = this.headers.delete('Authorization');
    }
    return this.headers;
  }

  
}
