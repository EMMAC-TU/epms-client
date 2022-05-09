import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { DialogWindowComponent } from '../dialog-window/dialog-window.component';
import { AuthService } from '../services/auth.service';
import { CookieHelperService } from '../services/cookie-helper.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  hide = true;
  username="";
  password="";
  constructor(private dialog: MatDialog, 
    private auth: AuthService, 
    private cookie: CookieHelperService, 
    private router: Router,
    private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    if (this.auth.isLoggedIn()) {
      this.router.navigateByUrl('/')
    }
  }

  login() {
    if (this.username.length === 0 || this.password.length === 0) return;
    this.auth.login(this.username, this.password)
    .pipe(
      catchError((err) => {
        console.log(err.error);
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
  }

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

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {duration: 4000});
  }

}
