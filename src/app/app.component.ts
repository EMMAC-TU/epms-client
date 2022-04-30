import { Location } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  events: string[] = [];
  opened: boolean = true;
  title = 'EPMS-client';
  onLoginPage = false;
  constructor(private location: Location, private router: Router){}

  isOnLogin() {
    this.onLoginPage = this.location.path() === '/login';
    console.log(this.onLoginPage)
    return this.onLoginPage;
  }

}
