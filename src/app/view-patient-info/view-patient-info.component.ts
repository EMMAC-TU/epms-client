import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { DialogWindowComponent } from '../dialog-window/dialog-window.component';
import { MyErrorStateMatcher } from '../employee-creation/employee-creation.component';
import { PatientService } from '../services/patient.service';
import { ValidatorService } from '../services/validator.service';
import { Patient } from '../types/Patient';
import { PatientCreation } from '../types/PatientCreation';

@Component({
  selector: 'app-view-patient-info',
  templateUrl: './view-patient-info.component.html',
  styleUrls: ['./view-patient-info.component.css']
})
export class ViewPatientInfoComponent implements OnInit {
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

  patient: Patient = {};
  updatedFields: PatientCreation = {};
  isOutPatient = 'Yes';
  isBeingUpdated = false;

  constructor(
    private service: PatientService,
    private validator: ValidatorService,
    private activeRouter: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private router: Router,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.updatedFields = {};
    this.activeRouter.params.subscribe(
      (params) => {
        this.service.getAPatient(params['id']).pipe(
          catchError((err) => {
            if (err.error.code === 500) {
              this.openSnackBar("There was an issue on our side. Please try again later", "Confirm")
            } else {
              this.openSnackBar(err.error.message, 'Confirm');
            }
            this.router.navigateByUrl('/');
            return throwError(() => new Error(err.error.message));
          })
        ).subscribe((value) => {
          const res = value.body as Patient;
          this.setFields(res);
        });
      }
    )
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

  isDOBValid() {
    const dob = this.updatedFields.dateofbirth ? this.updatedFields.dateofbirth : "";
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
    this.validator.validateGender(this.updatedFields);
    const dialogRef = this.dialog.open(DialogWindowComponent, {
      width: '400px',
      data: {
        title: "Confirm Changes",
        confirm: 'YesNo',
        msg: this.updatedFields
      }
    });
    dialogRef.afterClosed().subscribe((value) => {
      if (!value) {
        return;
      } 
      this.service.updatePatient(this.patient.patientid, this.updatedFields)
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

  cleanData() {
    let obj = Object.entries(this.updatedFields).filter((value) => {
      let key = value[0];
      let val = value[1];
      let res = Object.entries(this.patient).findIndex((patVal) => patVal[0] === key && patVal[1] === val);
      if (val && res === -1) return value;
      return;
    }).reduce((prev, curr) => {
      let value = curr[1];
      return {...prev, [curr[0]]: value};
    }, {})
    this.updatedFields = obj as Patient;
  }

  goBackandReset() {
    this.isBeingUpdated = !this.isBeingUpdated;
    location.reload();
  }

  setFields(res: Patient) {
    this.patient = res;
    Object.entries(res).forEach((values) => {
      // Format Date of Birth
      if (values[0] === 'dateofbirth') { 
        this.patient.dateofbirth = new Date(values[1]).toDateString();
      }
      if (values[0] === 'creationdate') {
        this.patient.creationdate = new Date(values[1]).toDateString();
      }
      if (values[0] === 'outpatient') {
        this.isOutPatient = "Yes";
      }
      if (values[0] === 'gender') {
        this.patient.gender = values[1] === 'F' ? 'Female' : 'Male'
      }
    });
  }
  openSnackBar(msg: string, action: string) {
    this._snackBar.open(msg, action, {
      duration: 4000
    });
  }

}
