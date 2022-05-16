import { Location } from '@angular/common';
import { Component, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { BnNgIdleService } from 'bn-ng-idle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map, takeWhile } from 'rxjs';

/**
 * Class representing the applications root page
 */
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

  /**
  * Function to execute when the class is initialized. Handles 10 minute idle timeout 
  * @returns N/A
  */
  ngOnInit(): void {
    if (this.auth.isLoggedIn()){
      this.bnIdle.startWatching(600) //Timeouts afters 10 minutes
      .pipe(
        takeWhile(value => this.auth.isLoggedIn())
      ).subscribe((isTimedOut: boolean) => {
        if (isTimedOut) {
          this.logout();
          this._snackBar.open(
            "Your session has timed out!",
            "Confirm"
          );          
        }
      });
    }
  }

  /**
   * Function to navigate to the previous page
   */
  goBack() {
    this.location.back();
  }

  /**
   * Function to determine if the current page is the login page
   * @returns {boolen} Whether or not the current page is the login page
   */
  isOnLogin() {
    this.onLoginPage = this.location.path() === '/login';
    if (this.onLoginPage) 
      document.getElementById('container')?.style.setProperty('top', '0', 'important')
    return this.onLoginPage;
  }

  /**
   * Function to logout of the system and then redirect to login page
   */
  logout() {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }

  /**
   * Function to navigate to the optons page
   */
  openOptions() {
    this.router.navigateByUrl('/options');
  }

  /**
   * Function to navigate to the home page
   */
  goToHome() {
    this.router.navigate(['/'])
  }
}
