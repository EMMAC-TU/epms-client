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
  employeeid = new FormControl('',[Validators.minLength(this.MIN_ID_LEN)]);
  dateofbirth = new FormControl('');
  lastname = new FormControl('');
  matcher = new MyErrorStateMatcher();
  illegalChar = '';

  employeeQuery: BackendQuery = {
    dob: '',
    lastname: '',
    employeeid: '',
    limit: undefined,
    page: undefined
  }


  constructor(private dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private validator: ValidatorService,
    private service: AdminService,
    private router: Router) { }

  ngOnInit(): void {
  }

  submitSearch() {
    // Check required fields
    if (!this.employeeQuery.employeeid && !this.employeeQuery.lastname && !this.employeeQuery.dob){
      return;
    }

    if( this.employeeid.invalid ||
        this.lastname.invalid ||
        this.dateofbirth.invalid ){
      return
    }

    // Fields are good. Go ahead and make the request

    // this.employeeQuery = this.validator.createQueryRequest(this.employeeQuery);
    let queryParams = {dob: this.employeeQuery.dob,
                      lastname: this.employeeQuery.lastname,
                      employeeid: this.employeeQuery.employeeid,
                      limit: this.employeeQuery.limit,
                      page: this.employeeQuery.page}
    this.service.searchEmployees(queryParams)
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
        //  console.log(response.body.employee.employeeid);
        console.log(response.body)
        await this.router.navigateByUrl('/');
        return;
      } 
    });
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {duration: 4000});
  }


  isUserIdValid() {
    const id = this.employeeQuery.employeeid;
    if (id != null){
      const illegalchar = id.match(constants.ILLEGAL_CHAR_REGEX);
    this.illegalChar = "";
    if (id.includes(' ')) {
      this.employeeid.setErrors({
        'containSpace': true
      });
    } else if (id.length > 0 && id.length< constants.MIN_ID_LEN) {
      this.employeeid.setErrors({
        'lessthan5char': true
      });
    } else if (illegalchar){
      illegalchar.forEach((val) => {
        this.illegalChar += val + " "
      });
      this.employeeid.setErrors({
        'illegalchar': true
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

}
