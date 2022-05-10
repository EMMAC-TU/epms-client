import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { DialogWindowComponent } from '../dialog-window/dialog-window.component';
import { MyErrorStateMatcher } from '../employee-creation/employee-creation.component';
import { PatientService } from '../services/patient.service';
import { Patient } from '../types/Patient';
import { PatientCreation } from '../types/PatientCreation';

@Component({
  selector: 'app-view-patient-info',
  templateUrl: './view-patient-info.component.html',
  styleUrls: ['./view-patient-info.component.css']
})
export class ViewPatientInfoComponent implements OnInit {

  email = new FormControl('', [Validators.required, Validators.email]);
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
    private activeRouter: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.activeRouter.params.subscribe(
      (params) => {
        this.service.getAPatient(params['id']).pipe(
          catchError((err) => {
            console.log(err.error);
            if (err.error.code === 500) {
              this.openSnackBar("There was an issue on our side. Please try again later", "Confirm")
              return throwError(() => new Error('Something bad happened; please try again later.'));
            }
            this.openSnackBar(err.error.message, 'Confirm');
            return throwError(() => new Error(err.error.message));
          })
        ).subscribe((value) => {
          const res = value.body as Patient;
          console.log(res);
          this.setFields(res);
        });
      }
    )
  }

  updateFields() {
    this.isBeingUpdated = !this.isBeingUpdated;
  }

  submit() {
    const dialogRef = this.dialog.open(DialogWindowComponent, {
      width: '400px',
      data: {
        title: "Confirm Changes",
        confirm: 'YesNo',
        msg: this.updatedFields
      }
    });
    this.isBeingUpdated = !this.isBeingUpdated;
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
