import { Component, OnInit, ViewChild } from '@angular/core';
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
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { formatDate } from '@angular/common';
import { EmployeeQueryResp } from '../types/EmployeeQueryResp';
import { ViewUpdateEmployeeComponent } from '../view-update-employee/view-update-employee.component';


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
 * Class representing the "Search Employee" page
 */
@Component({
  selector: 'app-search-employee',
  templateUrl: './search-employee.component.html',
  styleUrls: ['./search-employee.component.css']
})
export class SearchEmployeeComponent implements OnInit {
  // Class variables
  @ViewChild('myPaginator') myPaginator: MatPaginator | undefined;  // Allow access to the MatPaginator HTML object
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

  /**
   * Function that gets executed on class instantiation. It will submit a search to get initial results.
   */
  ngOnInit(): void {
    this.submitSearch();
  }

  /**
   * Function to submit a search to the database
   * @param {boolean} resetPage Whether or not to reset the pagination to the first page
   * @returns N/A
   */
  submitSearch(resetPage: boolean=false) {
    // Verify inputs are valid
    if( this.employeeid.hasError('invaliduuidv4') ||
        this.lastname.invalid ||
        this.dateofbirth.hasError('invalidDate') ){
      return
    }
    if (resetPage){
      this.employeeQuery.page = 0;
      this.myPaginator?.firstPage()
    }
    // Fields are good. Go ahead and make the request
    this.service.searchEmployees(this.employeeQuery)
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
        this.employeeResp.employee = response.body.employees;
        this.employeeResp.totalItemsMatched = response.body.count;
        this.totalNumItems = this.employeeResp.totalItemsMatched;
        return;
      } 
    });
  }

  /**
   * Function to go to view a specific employee record
   * @param employeeid The employeeid of the employee to display
   */
  openEmployeeDialog(employeeid?: string) {
    this.router.navigate(['/employee', employeeid]);
  }

  /**
   * Function to generate a snackBar popup window with the given information
   * @param {string} message The message to display
   * @param {string} action The text to display on the button which closes the snackBar
   */
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {duration: 4000});
  }

  /**
   * Function to verify an employeeID field
   * @returns N/A
   */
  isEmployeeIdValid() {
    const id = this.employeeQuery.employeeid ? this.employeeQuery.employeeid : '';
    if (!(id.match(constants.UUIDV4_REGEX)) && id !== '') {
      this.employeeid.setErrors({
        'invaliduuidv4': true
      });
    } else {
      this.employeeid.reset(this.employeeQuery.employeeid);
    }
  }

  /**
   * Function to verify a date of birth field
   * @returns N/A
   */
  isDOBValid() {
    const dob = this.employeeQuery.dob ? this.employeeQuery.dob : "";
    const isValid = this.validator.validateDateOfBirth(dob);
    if (!isValid) {
      this.dateofbirth.setErrors({
        'invalidDate': true
      })
    }
    if (dob === '') this.dateofbirth.reset();
  }

  /**
   * Function to execute when the pagination buttons are clicked.
   * @returns N/A
   */
  onChangePage(pe:PageEvent) {
    this.employeeQuery.limit= pe.pageSize;
    this.employeeQuery.page=pe.pageIndex + 1;

    // Query w/ updated page information
    this.submitSearch();
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
   * Function to change the formatting from A->Z or Z->A based on employee last name.
   */
  changeSort() {
    this.employeeQuery.sort = this.employeeQuery.sort === 1 ? -1 : 1;
    this.submitSearch();
  }
}