import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class CookieHelperService {

  constructor(private cookie: CookieService) { }

  createPresenceToken(token: string) {
    this.cookie.set('presence', token, 1, '/');
  }

  getPresenceToken(): string {
    return this.cookie.get('presence');
  }
}
