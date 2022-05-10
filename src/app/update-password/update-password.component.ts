import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { catchError, map, throwError } from 'rxjs';
import { DialogWindowComponent } from '../dialog-window/dialog-window.component';
import { AuthService } from '../services/auth.service';
import { ValidatorService } from '../services/validator.service';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.css']
})
export class UpdatePasswordComponent implements OnInit {

  hide = true;
  hideConfirm = true;
  hideNew = true;
  password = "";
  newPassword = "";
  confirmPassword = "";
  errMessage = "";

  passwordForm = new FormControl('');
  confirmPasswordForm = new FormControl('');
  newPasswordForm = new FormControl('');
  matcher = new MyErrorStateMatcher();

  constructor(
    public dialogRef: MatDialogRef<DialogWindowComponent>,
    private validator: ValidatorService,
    private auth: AuthService,
    private router: Router,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
  }

  updatePassword() {
    console.log("Hello?")
    if (
      this.confirmPasswordForm.hasError('passwordsDontMatch') ||
      this.newPasswordForm.hasError('invalidPassword') ||
      this.passwordForm.hasError('passwordsDontMatch')
    ) return;
    console.log("testing")
    this.auth.changePassword(this.password, this.newPassword)
    .pipe(
      catchError( (err) => {
        console.log("in error")
        console.log(err);
        if (err.error.code === 500) {
          this._snackBar.open("There was an issue on our side. Please try again later", "Confirm")
          return throwError(() => new Error('Something bad happened; please try again later.'));
        }
        if (err.error.code === 400) {
          this.passwordForm.setErrors({
            wrongPassword: true
          });
        }
        this._snackBar.open(err.error.message, 'Confirm');
        return throwError(() => new Error(err.error.message))
      })
    ).subscribe((value) => {
      console.log("in sub")
      this.auth.logout();
      this.dialogRef.close();
      this.router.navigateByUrl('/login');
      this._snackBar.open('Password Successfully Changed! Please Sign Back In', 'Confirm', {
        duration: 5000
      });
    });

    console.log("After")
  }

  isPasswordValid() {
    const msg = this.validator.validatePassword(this.newPassword);
    if (msg.length === 0) return;
    this.errMessage = msg;
    this.newPasswordForm.setErrors({
      invalidPassword: true
    });
  }

  confirmPasswords() {
    if (this.confirmPassword === this.newPassword){
      this.confirmPasswordForm.reset(this.confirmPassword);
      this.newPasswordForm.reset(this.newPassword);
      return;
    }
    this.confirmPasswordForm.setErrors({
      'passwordsDontMatch': true
    });
    this.newPasswordForm.setErrors({
      'passwordsDontMatch': true
    });
  }

}
