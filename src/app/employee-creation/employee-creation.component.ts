import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { DialogWindowComponent } from '../dialog-window/dialog-window.component';
import { AdminService } from '../services/admin.service';
import { ValidatorService } from '../services/validator.service';
import { constants } from '../types/Constants';
import { EmployeeCreation } from '../types/EmployeeCreation';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-employee-creation',
  templateUrl: './employee-creation.component.html',
  styleUrls: ['./employee-creation.component.css']
})
export class EmployeeCreationComponent implements OnInit {
  userid = new FormControl('');
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('');
  confirmPassword = new FormControl('');
  middleInit = new FormControl('', Validators.maxLength(1));
  mobilePhone = new FormControl('', Validators.pattern(constants.PHONE_REGEX));
  workPhone = new FormControl('', Validators.pattern(constants.PHONE_REGEX));
  homePhone = new FormControl('', Validators.pattern(constants.PHONE_REGEX));
  nokNumber = new FormControl('', Validators.pattern(constants.PHONE_REGEX));
  dateofbirth = new FormControl();
  matcher = new MyErrorStateMatcher();

  MIN_ID_LEN = constants.MIN_ID_LEN;
  hide=true;
  hide_confirm=true;
  illegalChar = '';
  errMessage = '';
  positions: string[] = ['administrator', 'doctor', 'nurse', 'vendor', 'receptionist', 'accountant'];
  newEmployee: EmployeeCreation = {
    userid: '',
    password: '',
    position: '',
    firstname: '',
    middleinitial: '',
    lastname: '',
    gender: '',
    dateofbirth: '',
    email: '',
    mobilephone: '',
    workphone: '',
    homephone: '',
    streetname1: '',
    streetname2: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
  };

  constructor(
    private dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private service: AdminService,
    private validator: ValidatorService,
    private router: Router) { }

  ngOnInit(): void {}

  openDialog() {
    // Check required fields
    if (!(this.newEmployee.firstname && 
      this.newEmployee.lastname && 
      this.newEmployee.dateofbirth && 
      this.newEmployee.email &&
      this.newEmployee.userid &&
      this.newEmployee.password &&
      this.newEmployee.position)){
      return;
    }
    if(
      this.userid.invalid ||
      this.email.invalid ||
      this.password.invalid ||
      this.confirmPassword.invalid ||
      this.middleInit.invalid ||
      this.mobilePhone.invalid ||
      this.workPhone.invalid ||
      this.homePhone.invalid ||
      this.nokNumber.invalid ||
      this.dateofbirth.invalid
    ){
      return;
    }
    const dialogRef = this.dialog.open(DialogWindowComponent, {
      width: '400px',
      data: {title: "Is the Following correct?", confirm: 'YesNo', msg: this.newEmployee},
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) this.onSubmit();
    });
  }

  onSubmit() {
    
    this.newEmployee = this.validator.createRegistrationRequest(this.newEmployee);
    this.service.createEmployee(this.newEmployee)
    .pipe(
      catchError( (err) => {
        if (err.error.code === 500) {
          this.openSnackBar("There was an issue on our side. Please try again later", "Confirm")
          return throwError(() => new Error('Something bad happened; please try again later.'));
        }
        this.openSnackBar(err.error.message, 'Confirm');
        return throwError(() => new Error(err.error.message));
      })
    )
    .subscribe(async (res) => {
      const response = res as any;
      if (response.status === 200 || response.status === 201) {
        await this.router.navigate(['/employee/', response.body.employee.employeeid]);
        this.openSnackBar('Employee has been created!', 'Confirm');
        return;
      } 
    });
  }

  isDOBValid() {
    const dob = this.newEmployee.dateofbirth ? this.newEmployee.dateofbirth : "";
    const isValid = this.validator.validateDateOfBirth(dob);
    if (!isValid) {
      this.dateofbirth.setErrors({
        'invalidDate': true
      })
    }
  }

  isPasswordValid() {
    const pwrd = this.newEmployee.password ? this.newEmployee.password : "";
    const msg = this.validator.validatePassword(pwrd);
    if (msg.length === 0) return;
    this.errMessage = msg;
    this.password.setErrors({
      'invalidPassword': true
    });
  }

  doPasswordsMatch(confirm: string) {
    if (this.newEmployee.password !== confirm) {
      this.confirmPassword.setErrors({
        'passwordsdonotmatch': true
      });
      this.password.setErrors({
        'passwordsdonotmatch': true
      });
    } else {
      this.password.reset(this.newEmployee.password);
      this.confirmPassword.reset(confirm);
    }
  }

  isUserIdValid() {
    const userid = this.newEmployee.userid ? this.newEmployee.userid : "";
    const illegalchar = userid.match(constants.ILLEGAL_CHAR_REGEX);
    this.illegalChar = "";
    if (userid.includes(' ')) {
      this.userid.setErrors({
        'containSpace': true
      });
    } else if (userid.length < this.MIN_ID_LEN) {
      this.userid.setErrors({
        'lessthan5char': true
      });
    } else if (illegalchar){
      illegalchar.forEach((val) => {
        this.illegalChar += val + " "
      });
      this.userid.setErrors({
        'illegalchar': true
      });
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {duration: 4000});
  }

}
