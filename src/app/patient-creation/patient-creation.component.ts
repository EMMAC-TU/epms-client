import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog'
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { DialogWindowComponent } from '../dialog-window/dialog-window.component';
import { PatientService } from '../services/patient.service';
import { ValidatorService } from '../services/validator.service';
import { constants } from '../types/Constants';
import { PatientCreation } from '../types/PatientCreation';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-patient-creation',
  templateUrl: './patient-creation.component.html',
  styleUrls: ['./patient-creation.component.css']
})
export class PatientCreationComponent implements OnInit {
  email = new FormControl('', [Validators.required, Validators.pattern(constants.EMAIL_REGEX)]);
  middleInit = new FormControl('', Validators.maxLength(1));
  mobilePhone = new FormControl('', Validators.pattern(constants.PHONE_REGEX));
  workPhone = new FormControl('', Validators.pattern(constants.PHONE_REGEX));
  homePhone = new FormControl('', Validators.pattern(constants.PHONE_REGEX));
  nokNumber = new FormControl('', Validators.pattern(constants.PHONE_REGEX));
  dateofbirth = new FormControl();
  matcher = new MyErrorStateMatcher();

  newPatient: PatientCreation = {
    firstname: '',
    middleinitial: '',
    lastname: '',
    gender: '',
    dateofbirth: undefined,
    outpatient: true,
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
    nok_firstname: '',
    nok_lastname: '',
    nok_mobilephone: '',
    insurance_companyname: '',
    insurance_groupnumber: '',
    insurance_memberid: '',
  }

  constructor(private dialog: MatDialog, 
    private service: PatientService, 
    private _snackBar: MatSnackBar,
    private validator: ValidatorService,
    private router: Router) { }

  ngOnInit(): void {
  }

  openDialog() {
    // Check required fields
    if (!(this.newPatient.firstname && 
      this.newPatient.lastname && 
      this.newPatient.dateofbirth && 
      this.newPatient.email)){
        this.openSnackBar('Please enter the required fields', 'Confirm');
      return;
    }
    if (
      this.email.invalid ||
      this.mobilePhone.invalid ||
      this.workPhone.invalid ||
      this.homePhone.invalid ||
      this.middleInit.invalid ||
      this.dateofbirth.getError('invalidDate') ||
      this.nokNumber.invalid
    ){
      return;
    }

    const dialogRef = this.dialog.open(DialogWindowComponent, {
      width: '400px',
      data: {title: "Is the Following correct?", confirm: 'YesNo', msg: this.newPatient},
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) this.onSubmit();
    });
  
  }

  onSubmit() {
    this.newPatient = this.validator.createRegistrationRequest(this.newPatient);
    this.service.createPatient(this.newPatient)
    .pipe(
      catchError( (err) => {
        if (err.error.code === 500 || !err.error.message) {
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
        await this.router.navigate(['/patient', response.body.patientid]);
        this.openSnackBar('Patient Created!', 'Confirm');
        return;
      }  
    });
  }

  isDOBValid() {
    const dob = this.newPatient.dateofbirth ? this.newPatient.dateofbirth : "";
    const isValid = this.validator.validateDateOfBirth(dob);
    if (!isValid) {
      this.dateofbirth.setErrors({
        'invalidDate': true
      })
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {duration: 4000});
  }
}
