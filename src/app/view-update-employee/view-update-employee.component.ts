import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { DialogWindowComponent } from '../dialog-window/dialog-window.component';
import { MyErrorStateMatcher } from '../employee-creation/employee-creation.component';
import { AdminService } from '../services/admin.service';
import { ValidatorService } from '../services/validator.service';
import { constants } from '../types/Constants';
import { Employee } from '../types/Employee';
import { EmployeeCreation } from '../types/EmployeeCreation';
import { Patient } from '../types/Patient';
import { UpdatePasswordComponent } from '../update-password/update-password.component';

/**
 * Class representing the page to view an employee
 */
@Component({
  selector: 'app-view-update-employee',
  templateUrl: './view-update-employee.component.html',
  styleUrls: ['./view-update-employee.component.css']
})
export class ViewUpdateEmployeeComponent implements OnInit {
  // Class variables
  userid = new FormControl('', [Validators.maxLength(35)]);
  enddate = new FormControl('');
  firstname = new FormControl('', [Validators.maxLength(35)]);
  lastname = new FormControl('', [Validators.maxLength(35)]);
  email = new FormControl('', Validators.pattern(constants.EMAIL_REGEX));
  middleInit = new FormControl('', Validators.maxLength(1));
  mobilePhone = new FormControl('', Validators.pattern(constants.PHONE_REGEX));
  workPhone = new FormControl('', Validators.pattern(constants.PHONE_REGEX));
  homePhone = new FormControl('', Validators.pattern(constants.PHONE_REGEX));
  nokNumber = new FormControl('', Validators.pattern(constants.PHONE_REGEX));
  dateofbirth = new FormControl();
  matcher = new MyErrorStateMatcher();

  employee: Employee = {};
  updatedEmp: EmployeeCreation = {};
  isBeingUpdated = false;
  illegalChars = "";

  constructor(
    private service: AdminService, 
    private validator: ValidatorService,
    private activeRouter: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private router: Router,
    private dialog: MatDialog,
  ) { }

  /**
  * Function to execute when the class is initialized. Requests the employee information from the backend
  * @returns N/A
  */
  ngOnInit(): void {
    this.updatedEmp = {};
    this.activeRouter.params.subscribe(
      (params) => {
        this.service.getEmployee(params['id']).pipe(
          catchError((err) => {
            if (err.error.code === 500) {
              this.openSnackBar("There was an issue on our side. Please try again later", "Confirm")
            } else {
              this.openSnackBar(err.error.message, 'Confirm');
            }
            this.router.navigateByUrl('/');
            return throwError(() => new Error(err.error.message));
          })
        ).subscribe(
          (value) => {
            const res = (value.body as any).employee as Employee;
            this.setFields(res);
          }
        )
      }
    )
  }

  /**
   * Function to enable an authorized employee to update their or another employee's password
   */
  updatePassword() {
    this.dialog.open(UpdatePasswordComponent, {
      data: {
        employeeid: this.employee.employeeid
      }
    });
  }

  /**
  * Function used to determine if the end date is valid
  * @param {string} enddate The end date to validate
  * @returns {boolean} true if it is valid, false otherwise
  */
  validateEndDate() {
    const enddate = this.updatedEmp.enddate ? this.updatedEmp.enddate : "";
    const isValid = this.validator.validateEndDate(enddate);
    if (!isValid) {
      this.enddate.setErrors({
        'invalidDate': true
      });
    }
  }

  /**
   * Function to verify a UserID is valid
   * @returns N/A
   */
  validateUserId() {
    let illegalchar = this.validator.isUserIdValid(this.userid, this.updatedEmp.userid);
    if (illegalchar.length === 0) {
      this.illegalChars = "";
      return;
    }
    illegalchar.forEach((val) => {
      this.illegalChars = val;
    });
  }

  /**
   * Function to flip the status of whether the currently viewed employee record is being modified
   */
  updateFields() {
    this.isBeingUpdated = !this.isBeingUpdated;
  }

  /**
   * Function to update an employee record
   * @returns N/A
   */
  submit() {
    if (
      this.firstname.hasError('empty') ||
      this.lastname.hasError('empty') ||
      this.email.hasError('empty') ||
      this.userid.hasError('empty')
    ) {
      this.openSnackBar('Please enter the required fields', 'Confirm');
      return;
    }
    if (
      this.email.invalid ||
      this.middleInit.invalid ||
      this.mobilePhone.invalid ||
      this.workPhone.invalid ||
      this.homePhone.invalid ||
      this.nokNumber.invalid ||
      this.dateofbirth.hasError('invalidDate')
    ) return;

    this.cleanData();
    if (Object.entries(this.updatedEmp).length === 0) { // No changes were made
      this.openSnackBar('No changes were made!', 'Confirm');
      return;
    }
    this.validator.validateGender(this.updatedEmp);
    const dialogRef = this.dialog.open(DialogWindowComponent, {
      width: '400px',
      data: {
        title: "Confirm Changes",
        confirm: 'YesNo',
        msg: this.updatedEmp
      }
    });
    dialogRef.afterClosed().subscribe((value) => {
      if (!value) {
        return;
      } 
      this.service.updateEmployee(this.employee.employeeid, this.updatedEmp)
      .pipe(
        catchError((err) => {
            if (err.error.code === 500) {
              this.openSnackBar("There was an issue on our side. Please try again later", "Confirm")
            } else {
              this.openSnackBar(err.error.message, 'Confirm');
            }
            return throwError(() => new Error(err.error.message));
        })
      ).subscribe((value) => {
        location.reload();
      });
    });
  }

  /**
  * Function to check if the page needs to be reloaded
  */
  goBackandReset() {
    this.isBeingUpdated = !this.isBeingUpdated;
    location.reload();
  }

  /**
  * Function to prepare the data for sending the request to the backend
  */
  cleanData() {
    let obj = Object.entries(this.updatedEmp).filter((value) => {
      let key = value[0];
      let val = value[1];
      let res = Object.entries(this.employee).findIndex((patVal) => patVal[0] === key && patVal[1] === val);
      if (val && res === -1) return value;
      return;
    }).reduce((prev, curr) => {
      let value = curr[1];
      return {...prev, [curr[0]]: value};
    }, {})
    this.updatedEmp = obj as Patient;
  }

  /**
  * Function to verify the Date of Birth field
  * @returns N/A
  */
  isDOBValid() {
    const dob = this.updatedEmp.dateofbirth ? this.updatedEmp.dateofbirth : "";
    const isValid = this.validator.validateDateOfBirth(dob);
    if (!isValid) {
      this.dateofbirth.setErrors({
        'invalidDate': true
      });
    }
    if (dob === "" && this.dateofbirth.hasError('invalidDate')) {
      this.dateofbirth.reset();
    }
  }

  /**
  * Function to verify all required fields have been input
  * @param {string} text The data to check
  * @param {string} type The type of field
  * @returns N/A
  */
  requiredField(text: string | undefined, type: string) {
    if (text && text.length > 0) return;

    switch(type) {
      case 'firstname':
        this.firstname.setErrors({
          empty: true
        });
        break;
      case 'lastname':
        this.lastname.setErrors({
          empty: true
        });
        break;
      case 'email':
        this.email.setErrors({
          empty: true
        });
    }
  }

  /**
  * Function to parse the response from the backend
  * @param {Employee} res The response to parse
  */
  setFields(res: Employee) {
    this.employee = res;
    Object.entries(res).forEach((values) => {
      // Format Date of Birth
      if (values[0] === 'dateofbirth') { 
        this.employee.dateofbirth = this.convert_date(values[1]);
      }
      if (values[0] === 'startdate') {
        this.employee.startdate = this.convert_date(values[1]);
      }
      if (values[0] === 'gender') {
        this.employee.gender = values[1] === 'F' ? 'Female' : 'Male'
      }
    });
  }

  /**
  * Function to convert a date to the longDate format (Ex: "May 9, 2022")
  * @returns {string} The formatted date, or an empty string
  */
  convert_date(date?:string){
    if ( date != undefined && date != null){
      return formatDate(date, "longDate", 'en-US', 'UTC')
    }
    return ""
  }

  /**
  * Function to generate a snackBar popup window with the given information
  * @param {string} message The message to display
  * @param {string} action The text to display on the button which closes the snackBar
  */
  openSnackBar(msg: string, action: string) {
    this._snackBar.open(msg, action, {
      duration: 4000
    });
  }

}
