import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DialogWindowComponent } from '../dialog-window/dialog-window.component';
import { AuthService } from '../services/auth.service';
import { ValidatorService } from '../services/validator.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  hide = true;
  username="";
  password="";
  constructor(private dialog: MatDialog, private auth: AuthService, private validator: ValidatorService, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

  login() {
    this.auth.login(this.username, this.password).subscribe(val => {
      const res = val as any;
      if (res.code === 401) {
        this.openSnackBar(res.message, "Confirm");
      }
      if (res.token) {
        console.log(res.token);
      }
    });
  }

  contactAdmin() {
    const dialogRef = this.dialog.open(DialogWindowComponent, {
      width: '400px',
      data: {title: "Please Contact An Administrator To Reset Your Username or Password", confirm: 'Ok'}
    });

  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

}
