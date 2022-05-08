import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

const TOKEN_NAME = 'presence'

@Injectable({
  providedIn: 'root'
})
export class CookieHelperService {

  constructor(private cookie: CookieService) { }

  createPresenceToken(token: string) {
    this.cookie.set(TOKEN_NAME, token, 1, '/');
  }

  getPresenceToken(): string {
    return this.cookie.get(TOKEN_NAME);
  }

  deleteToken(): boolean {
    this.cookie.delete(TOKEN_NAME, '/');
    return true;
  }
}
