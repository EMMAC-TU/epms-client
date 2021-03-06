import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, map, throwError } from 'rxjs';
import { DialogWindowComponent } from '../dialog-window/dialog-window.component';
import { MyErrorStateMatcher } from '../employee-creation/employee-creation.component';
import { AuthService } from '../services/auth.service';
import { PatientService } from '../services/patient.service';
import { ValidatorService } from '../services/validator.service';
import { constants } from '../types/Constants';
import { Patient } from '../types/Patient';
import { PatientCreation } from '../types/PatientCreation';
import { PERMISSIONS } from '../types/Permissions';

/**
 * Class representing the page to view a patient
 */
@Component({
  selector: 'app-view-patient-info',
  templateUrl: './view-patient-info.component.html',
  styleUrls: ['./view-patient-info.component.css']
})
export class ViewPatientInfoComponent implements OnInit {
  // Class variables
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
    private auth: AuthService
  ) { }

  /**
  * Function to execute when the class is initialized. Requests the patient information from the backend
  * @returns N/A
  */
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
  * Function to verify the Date of Birth field
  * @returns N/A
  */
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

  /**
   * Checks to see if the user is authorized to update a patient
   */
  isAuthorized() {
    return this.auth.isAuthorized([
      PERMISSIONS.ADMIN, 
      PERMISSIONS.DOCTOR, 
      PERMISSIONS.NURSE, 
      PERMISSIONS.RECEPTIONIST
    ]).pipe(
        catchError((err) => {
            if (err.error.code === 500) {
              this.openSnackBar("There was an issue on our side. Please try again later", "Confirm")
            } else {
              this.openSnackBar(err.error.message, 'Confirm');
            }
            return throwError(() => new Error(err.error.message));
        })
      ).subscribe((res) => {
        const response = res.body as any;
        if (!response.isAuthorized) {
          this.openSnackBar('You are not authorized to update a patient', 'Confirm');
        } else {
          this.isBeingUpdated = !this.isBeingUpdated;
        }
      })
  }

  /**
   * Function to verify a user is allowed to view a patient
   */
  updateFields() {
    this.isAuthorized();      
  }

  /**
   * Submit the request to view a patient to the backend
   * @returns Nothing on error, redirects to the patient's page on success
   */
  submit() {
    if (
      this.firstname.hasError('empty') ||
      this.lastname.hasError('empty') ||
      this.email.hasError('empty')
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
    if (Object.entries(this.updatedFields).length === 0) { // No changes were made
      this.openSnackBar('No changes were made!', 'Confirm');
      return;
    }
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

  /**
   * Function to prepare the data for sending the request to the backend
   */
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

  /**
   * Function to check if the page needs to be reloaded
   */
  goBackandReset() {
    this.isBeingUpdated = !this.isBeingUpdated;
    location.reload();
  }

  /**
   * Function to parse the response from the backend
   * @param {Patient} res The response to parse
   */
  setFields(res: Patient) {
    this.patient = res;
    Object.entries(res).forEach((values) => {
      // Format Date of Birth
      if (values[0] === 'dateofbirth') { 
        this.patient.dateofbirth = this.convert_date(values[1]);
      }
      if (values[0] === 'creationdate') {
        this.patient.creationdate = this.convert_date(values[1]);
      }
      if (values[0] === 'outpatient') {
        this.isOutPatient = "Yes";
      }
      if (values[0] === 'gender') {
        this.patient.gender = values[1] === 'F' ? 'Female' : 'Male'
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
