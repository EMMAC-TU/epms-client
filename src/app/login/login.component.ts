import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { DialogWindowComponent } from '../dialog-window/dialog-window.component';
import { AuthService } from '../services/auth.service';
import { CookieHelperService } from '../services/cookie-helper.service';

/**
 * Class representing the Login page
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  // Class variables
  hide = true;
  username="";
  password="";
  constructor(
    private dialog: MatDialog, 
    private auth: AuthService, 
    private cookie: CookieHelperService, 
    private router: Router,
    private _snackBar: MatSnackBar) { }

  /**
  * Function to execute when the class is initialized. Redirects to the home page if the user
  *    is already logged in.
  * @returns N/A
  */
    ngOnInit(): void {
    if (this.auth.isLoggedIn()) {
      this.router.navigateByUrl('/')
    }
  }

  /**
   * This function will perform the login to the EHRS. If login is successful it will redirecto to the hope page.
   * @returns An error if no username or password was input, or the server returns an error code.
   */
  login() {
    if (this.username.length === 0 || this.password.length === 0) {
      this.openSnackBar("Please input a username and password to continue", "Confirm")
      return throwError(() => new Error("Empty username or password"));
    }
    this.auth.login(this.username, this.password)
    .pipe(
      catchError((err) => {
        if (err.error.code === 500) {
          this.openSnackBar("There was an issue on our side. Please try again later", "Confirm")
          return throwError(() => new Error('Something bad happened; please try again later.'));
        }
        this.openSnackBar(err.error.message, 'Confirm');
        return throwError(() => new Error(err.error.message));
      })
    ).subscribe(async val => {
      const res = val as any;
      if (res.token) {
        this.cookie.createPresenceToken(res.token);
        await this.router.navigateByUrl('/');
        location.reload();
      }
    });
    return;
  }

  /**
   * This function will generate a dialog-window to inform the user next steps when they
   *  forget their username or password
   */
  contactAdmin() {
    this.dialog.open(DialogWindowComponent, {
      width: '400px',
      data: {
        title: "Reset Username/Password", 
        confirm: 'Ok', 
        msg: "Please Contact An Administrator To Reset Your Username or Password"
      }
    });

  }

  /**
   * Function to generate a snackBar popup window with the given information
   * @param {string} message The message to display
   * @param {string} action The text to display on the button which closes the snackBar
   */
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {duration: 4000});
  }

  /**
   * Function to be executed any time the "ENTER" key is pressed within an input. It should 
   *  take the same actions as the login button (which is to call the login function).
   * @param event 
   */
  handleEnterKeyDown(event: any) {
    this.login()
  }
}
