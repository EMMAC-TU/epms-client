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

/**
 * Class to handle errors for invalid/null input into the form
 */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  /**
   * Checks if a field is in an error state and returns the result
   * @param control the item to check
   * @param form the form to check
   * @returns true if the control is in an error state, false otherwise
   */
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

/**
 * Class representing the "Create Employee" page
 */
@Component({
  selector: 'app-employee-creation',
  templateUrl: './employee-creation.component.html',
  styleUrls: ['./employee-creation.component.css']
})
export class EmployeeCreationComponent implements OnInit {
  // Class variables
  userid = new FormControl('');
  email = new FormControl('', [Validators.required, Validators.pattern(constants.EMAIL_REGEX)]);
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
  confirmPasswordField = '';

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

  /**
   * Function to execute when the class is initialized.
   */
  ngOnInit(): void {}

  /**
   * Function to verify fields are ready for submission, and then open the confirmation dialog window.
   * @returns N/A
   */
  openDialog() {
    // Confirm Passwords
    this.doPasswordsMatch();

    // Check required fields
    if (!(this.newEmployee.firstname && 
      this.newEmployee.lastname && 
      this.newEmployee.dateofbirth && 
      this.newEmployee.email &&
      this.newEmployee.userid &&
      this.newEmployee.password &&
      this.newEmployee.position)){
        this.openSnackBar('Please enter the required fields', 'Confirm');
      return;
    }
    if(
      this.userid.invalid ||
      this.email.invalid ||
      this.password.hasError('invalidPassword') ||
      this.password.hasError('passwordsdonotmatch') ||
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

  /**
   * Function to execute after the form has been verified and confirmed. Submits the new employee request to the back and and handles the response
   * Creates a SnackBar error message if the request fails, or a success message on success.
   * @returns Nothing on success, otherwise an Error and the appropriate message
   */
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

  /**
   * Function to verify the Date of Birth field
   * @returns N/A
   */
  isDOBValid() {
    const dob = this.newEmployee.dateofbirth ? this.newEmployee.dateofbirth : "";
    const isValid = this.validator.validateDateOfBirth(dob);
    if (!isValid) {
      this.dateofbirth.setErrors({
        'invalidDate': true
      })
    }
  }

  /**
   * Function to verify a password field
   * @returns N/A
   */
  isPasswordValid() {
    const pwrd = this.newEmployee.password ? this.newEmployee.password : "";
    const msg = this.validator.validatePassword(pwrd);
    if (msg.length === 0) {
      this.doPasswordsMatch();
      return;
    } 
    this.errMessage = msg;
    this.password.setErrors({
      'invalidPassword': true
    });
  }

  /**
   * Function to check if a password field matches the contents of another password field.
   * Sets the appropriate setErrors message for the password FormControl
   * @returns N/A
   */
  doPasswordsMatch() {
    if (
      this.password.hasError('invalidPassword') || 
      this.confirmPasswordField === ''
      ) return;

    if (this.confirmPasswordField === this.newEmployee.password) {
      this.password.reset(this.newEmployee.password);
      this.confirmPassword.reset(this.confirmPasswordField);
      return;
    }

    this.password.setErrors({
      'passwordsdonotmatch': true
    });

    this.confirmPassword.setErrors({
      'passwordsdonotmatch': true
    });
  }

  /**
   * Function to verify a UserID field
   * @returns N/A
   */
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

  /**
   * Function to generate a snackBar popup window with the given information
   * @param {string} message The message to display
   * @param {string} action The text to display on the button which closes the snackBar
   */
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {duration: 4000});
  }

}
