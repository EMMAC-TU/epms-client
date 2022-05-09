import { Location } from '@angular/common';
import { Component, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { BnNgIdleService } from 'bn-ng-idle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map, takeWhile } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'EPMS-client';
  onLoginPage = false;
  isSideBarOpen = true;
  timeoutSnackBarOpen = false;
  constructor(
    private location: Location, 
    private router: Router, 
    private auth: AuthService,
    private bnIdle: BnNgIdleService,
    private _snackBar: MatSnackBar
  ){}

  ngOnInit(): void {
    if (this.auth.isLoggedIn()){
      this.bnIdle.startWatching(600) //Timeouts afters 10 minutes
      .pipe(
        takeWhile(value => this.auth.isLoggedIn())
      ).subscribe((isTimedOut: boolean) => {
        if (isTimedOut) {
          console.log("Timeout")
          this.logout();
          this._snackBar.open(
            "Your session has timeout!",
            "Confirm"
          );          
        }
      });
    }
  }

  isOnLogin() {
    this.onLoginPage = this.location.path() === '/login';
    return this.onLoginPage;
  }

  logout() {
    this.auth.logout();
    this.router.navigateByUrl('/login')
  }
  goToHome() {
    this.router.navigate(['/'])
  }
}
