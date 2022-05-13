import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ErrorStateMatcher } from '@angular/material/core';
import { constants } from '../types/Constants';
import { BackendQuery} from '../types/BackendQuery'
import { ValidatorService } from '../services/validator.service';
import { AdminService } from '../services/admin.service';
import { catchError, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { formatDate } from '@angular/common';
import { EmployeeQueryResp } from '../types/EmployeeQueryResp';
import { ViewUpdateEmployeeComponent } from '../view-update-employee/view-update-employee.component';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-search-employee',
  templateUrl: './search-employee.component.html',
  styleUrls: ['./search-employee.component.css']
})
export class SearchEmployeeComponent implements OnInit {
  MIN_ID_LEN = constants.MIN_ID_LEN;
  employeeid = new FormControl('',[Validators.pattern(constants.UUIDV4_REGEX)]);
  dateofbirth = new FormControl('');
  lastname = new FormControl('');
  matcher = new MyErrorStateMatcher();
  illegalChar = '';

  pageEvent: PageEvent | undefined;
  displayedColumns: string[] = ["EmployeeID", "Name", "DateOfBirth"]

  employeeResp: EmployeeQueryResp = {employee:[], totalItemsMatched:0};
  numRowsToShow: number = 10;
  pageSizeOptions: number[] = [10, 25, 50, 100];
  totalNumItems: number = 0;  // Total number of items
  currentPage:number = 0;  // The page we're currently on

  employeeQuery: BackendQuery = {
    dob: '',
    lastname: '',
    employeeid: '',
    limit: this.numRowsToShow,
    page: 1,
    sort: 1
  }

  constructor(private dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private validator: ValidatorService,
    private service: AdminService,
    private router: Router) {}

  ngOnInit(): void {
    this.submitSearch();
  }

  submitSearch() {
    // Verify inputs are valid
    if( this.employeeid.invalid ||
        this.lastname.invalid ||
        this.dateofbirth.invalid ){
      return
    }

    // Fields are good. Go ahead and make the request
    this.service.searchEmployees(this.employeeQuery)
    .pipe(
      catchError( (err) => {
        console.log(err.error);
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
        console.log(response.body.employees)
        this.employeeResp.employee = response.body.employees;
        this.employeeResp.totalItemsMatched = response.body.count;
        this.totalNumItems = this.employeeResp.totalItemsMatched;
        return;
      } 
    });
  }

  openEmployeeDialog(employeeid?: string) {
    this.router.navigate(['/employee', employeeid]);
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {duration: 4000});
  }


  isEmployeeIdValid() {
    const id = this.employeeQuery.employeeid;
    if (id != null){
      if (!(id.match(constants.UUIDV4_REGEX))) {
        this.employeeid.setErrors({
          'invaliduuidv4': true
        });
      }
    }
  }

  isDOBValid() {
    const dob = this.employeeQuery.dob ? this.employeeQuery.dob : "";
    const isValid = this.validator.validateDateOfBirth(dob);
    if (!isValid) {
      this.dateofbirth.setErrors({
        'invalidDate': true
      })
    }
  }

  onChangePage(pe:PageEvent) {
    console.log(pe.pageIndex);
    console.log(pe.pageSize);
    this.employeeQuery.limit= pe.pageSize;
    this.employeeQuery.page=pe.pageIndex + 1;

    // Query w/ New page information
    this.submitSearch();
  }

  convert_date(date?:string){
    if ( date != undefined && date != null){
      return formatDate(date, "longDate", 'en-US')
    }
    return ""
  }
}