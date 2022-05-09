import { Location } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CookieHelperService } from './services/cookie-helper.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'EPMS-client';
  onLoginPage = false;
  isSideBarOpen = true;

  constructor(private location: Location, private router: Router, private cookie: CookieHelperService){}

  isOnLogin() {
    this.onLoginPage = this.location.path() === '/login';
    return this.onLoginPage;
  }

  async logout() {
    this.cookie.deleteToken();
    await this.router.navigateByUrl('/login');
  }
  goToHome() {
    this.router.navigate(['/'])
  }
}
