import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

const TOKEN_NAME = 'presence'

/**
 * Class representing the "cookie-helper Service"
 */
@Injectable({
  providedIn: 'root'
})
export class CookieHelperService {

  constructor(private cookie: CookieService) { }

  /**
   * Function to create a cookie using the token received from the back end which identifies a logged in user
   * @param {string} token 
   */
  createPresenceToken(token: string) {
    this.cookie.set(TOKEN_NAME, token, .3, '/');
  }

  /**
   * Get/return the presence token
   * @returns The 
   */
  getPresenceToken(): string {
    return this.cookie.get(TOKEN_NAME);
  }

  /**
   * Delete the presence token
   * @returns 
   */
  deleteToken(): boolean {
    this.cookie.delete(TOKEN_NAME, '/');
    return true;
  }
}
