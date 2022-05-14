import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ErrorStateMatcher } from '@angular/material/core';
import { constants } from '../types/Constants';
import { BackendQuery} from '../types/BackendQuery'
import { ValidatorService } from '../services/validator.service';
import { PatientService } from '../services/patient.service';
import { catchError, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { formatDate } from '@angular/common';
import { PatientQueryResp } from '../types/PatientQueryResp';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-search-patient',
  templateUrl: './search-patient.component.html',
  styleUrls: ['./search-patient.component.css']
})
export class SearchPatientComponent implements OnInit {
  @ViewChild('myPaginator') myPaginator: MatPaginator | undefined;
  MIN_ID_LEN = constants.MIN_ID_LEN;
  patientid = new FormControl('',[Validators.pattern(constants.UUIDV4_REGEX)]);
  dateofbirth = new FormControl('');
  lastname = new FormControl('');
  matcher = new MyErrorStateMatcher();
  illegalChar = '';

  pageEvent: PageEvent | undefined;
  displayedColumns: string[] = ["PatientID", "Name", "DateOfBirth"]

  patientResp: PatientQueryResp = {patient:[], totalItemsMatched:0};
  numRowsToShow: number = 10;
  pageSizeOptions: number[] = [10, 25, 50, 100];
  totalNumItems: number = 0;  // Total number of items
  currentPage:number = 0;  // The page we're currently on

  patientQuery: BackendQuery = {
    dob: '',
    lastname: '',
    patientid: '',
    limit: this.numRowsToShow,
    page: 1,
    sort: 1
  }

  constructor(private dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private validator: ValidatorService,
    private service: PatientService,
    private router: Router) {}

  ngOnInit(): void {
    this.submitSearch();
  }

  submitSearch(resetPage: boolean=false) {
    // Verify inputs are valid
    if( this.patientid.hasError('invaliduuidv4') ||
        this.lastname.invalid ||
        this.dateofbirth.hasError('invalidDate') ){
      return
    }
    if (resetPage){
      this.patientQuery.page = 0;
      this.myPaginator?.firstPage()
    }
    // Fields are good. Go ahead and make the request
    this.service.searchPatients(this.patientQuery)
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
        this.patientResp.patient = response.body.patients;
        this.patientResp.totalItemsMatched = response.body.count;
        this.totalNumItems = this.patientResp.totalItemsMatched;
        return;
      } 
    });
  }

  openPatientDialog(patientid?: string) {
    this.router.navigate(['/patient', patientid]);
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {duration: 4000});
  }


  isPatientIdValid() {
    const id = this.patientQuery.patientid ? this.patientQuery.patientid : '';
    if (!(id.match(constants.UUIDV4_REGEX)) && id !== '') {
      this.patientid.setErrors({
        'invaliduuidv4': true
      });
    } else {
      this.patientid.reset(this.patientQuery.patientid);
    }
  }

  isDOBValid() {
    const dob = this.patientQuery.dob ? this.patientQuery.dob : "";
    const isValid = this.validator.validateDateOfBirth(dob);
    if (!isValid) {
      this.dateofbirth.setErrors({
        'invalidDate': true
      })
    }
    if (dob === '') this.dateofbirth.reset();
  }

  onChangePage(pe:PageEvent) {
    this.patientQuery.limit= pe.pageSize;
    this.patientQuery.page=pe.pageIndex + 1;

    // Query w/ New page information
    this.submitSearch();
  }

  convert_date(date?:string){
    if ( date != undefined && date != null){
      return formatDate(date, "longDate", 'en-US', 'UTC')
    }
    return ""
  }

  changeSort() {
    this.patientQuery.sort = this.patientQuery.sort === 1 ? -1 : 1;
    this.submitSearch();
  }
}