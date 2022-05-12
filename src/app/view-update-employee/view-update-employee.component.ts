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
import { Employee } from '../types/Employee';
import { EmployeeCreation } from '../types/EmployeeCreation';
import { Patient } from '../types/Patient';
import { UpdatePasswordComponent } from '../update-password/update-password.component';

@Component({
  selector: 'app-view-update-employee',
  templateUrl: './view-update-employee.component.html',
  styleUrls: ['./view-update-employee.component.css']
})
export class ViewUpdateEmployeeComponent implements OnInit {
  userid = new FormControl('', [Validators.maxLength(35)]);
  enddate = new FormControl('');
  firstname = new FormControl('', [Validators.maxLength(35)]);
  lastname = new FormControl('', [Validators.maxLength(35)]);
  email = new FormControl('', [Validators.email]);
  middleInit = new FormControl('', Validators.maxLength(1));
  mobilePhone = new FormControl('', Validators.pattern(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im));
  workPhone = new FormControl('', Validators.pattern(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im));
  homePhone = new FormControl('', Validators.pattern(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im));
  nokNumber = new FormControl('', Validators.pattern(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im));
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
    private dialog: MatDialog
  ) { }

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

  updatePassword() {
    this.dialog.open(UpdatePasswordComponent, {
      data: {
        employeeid: this.employee.employeeid
      }
    });
  }

  validateEndDate() {
    const enddate = this.updatedEmp.enddate ? this.updatedEmp.enddate : "";
    const isValid = this.validator.validateEndDate(enddate);
    if (!isValid) {
      this.enddate.setErrors({
        'invalidDate': true
      });
    }
  }

  validateUserId() {
    let illegalchar = this.validator.isUserIdValid(this.userid, this.updatedEmp.userid);
    if (illegalchar.length === 0) {
      this.illegalChars = "";
      return;
    }
    illegalchar.forEach((val) => {
      !this.illegalChars.includes(val) ? this.illegalChars += val + " " : ""
    });
  }

  updateFields() {
    this.isBeingUpdated = !this.isBeingUpdated;
  }

  submit() {
    if (
      this.firstname.hasError('empty') ||
      this.lastname.hasError('empty') ||
      this.email.invalid ||
      this.email.hasError('empty') ||
      this.middleInit.invalid ||
      this.mobilePhone.invalid ||
      this.workPhone.invalid ||
      this.homePhone.invalid ||
      this.nokNumber.invalid ||
      this.dateofbirth.hasError('invalidDate')
    ) return;

    this.cleanData();
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

  goBackandReset() {
    this.isBeingUpdated = !this.isBeingUpdated;
    location.reload();
  }

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

  setFields(res: Employee) {
    this.employee = res;
    Object.entries(res).forEach((values) => {
      // Format Date of Birth
      if (values[0] === 'dateofbirth') { 
        this.employee.dateofbirth = new Date(values[1]).toDateString();
      }
      if (values[0] === 'startdate') {
        this.employee.startdate = new Date(values[1]).toDateString();
      }
      if (values[0] === 'gender') {
        this.employee.gender = values[1] === 'F' ? 'Female' : 'Male'
      }
    });
  }

  openSnackBar(msg: string, action: string) {
    this._snackBar.open(msg, action, {
      duration: 4000
    });
  }

}
