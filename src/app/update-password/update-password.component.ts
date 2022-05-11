import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { catchError, map, throwError } from 'rxjs';
import { DialogWindowComponent } from '../dialog-window/dialog-window.component';
import { AuthService } from '../services/auth.service';
import { ValidatorService } from '../services/validator.service';
import { Employee } from '../types/Employee';
import { EmployeeCreation } from '../types/EmployeeCreation';
import { Patient } from '../types/Patient';
import { PatientCreation } from '../types/PatientCreation';

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
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: { employeeid?: string }
  ) { }

  ngOnInit(): void {
    console.log(this.data)
  }

  updatePassword() {
    if (
      this.confirmPasswordForm.hasError('passwordsDontMatch') ||
      this.newPasswordForm.hasError('invalidPassword') ||
      this.passwordForm.hasError('passwordsDontMatch')
    ) return;
  
    this.auth.changePassword(this.password, this.newPassword, this.data.employeeid)
    .pipe(
      catchError( (err) => {
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
      if (this.data.employeeid) { // If an admin is updated a users password
        this.dialogRef.close();
        this._snackBar.open('Password Successfully Changed', 'Confirm', {
          duration: 5000
        });
      } else { //If a user is updated their own password
        this.auth.logout();
        this.dialogRef.close();
        this.router.navigateByUrl('/login');
        this._snackBar.open('Password Successfully Changed! Please Sign Back In', 'Confirm', {
          duration: 5000
        });
      }
    });

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
