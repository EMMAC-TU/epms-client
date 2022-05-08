import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DialogWindowComponent } from '../dialog-window/dialog-window.component';
import { AdminService } from '../services/admin.service';
import { ValidatorService } from '../services/validator.service';
import { EmployeeCreation } from '../types/EmployeeCreation';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-employee-creation',
  templateUrl: './employee-creation.component.html',
  styleUrls: ['./employee-creation.component.css']
})
export class EmployeeCreationComponent implements OnInit {
  userid = new FormControl('');
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('');
  confirmPassword = new FormControl('');
  middleInit = new FormControl('', Validators.maxLength(1));
  mobilePhone = new FormControl('', Validators.pattern(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im));
  workPhone = new FormControl('', Validators.pattern(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im));
  homePhone = new FormControl('', Validators.pattern(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im));
  nokNumber = new FormControl('', Validators.pattern(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im));
  dateofbirth = new FormControl();
  matcher = new MyErrorStateMatcher();

  hide=true;
  hide_confirm=true;
  illegalChar = '';
  positions: string[] = ['Administrator', 'Doctor', 'Nurse', 'Vendor', 'Receptionist'];
  newEmployee: EmployeeCreation = {
    userid: '',
    password: '',
    position: '',
    firstname: '',
    middleinitial: '',
    lastname: '',
    gender: '',
    dateofbirth: '',
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
  };

  constructor(
    private dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private service: AdminService,
    private validator: ValidatorService,
    private router: Router) { }

  ngOnInit(): void {
  }

  openDialog() {
    // Check required fields
    if (!(this.newEmployee.firstname && 
      this.newEmployee.lastname && 
      this.newEmployee.dateofbirth && 
      this.newEmployee.email &&
      this.newEmployee.userid &&
      this.newEmployee.password &&
      this.newEmployee.position)){
      return;
    }
    if(
      this.userid.invalid ||
      this.email.invalid ||
      this.password.invalid ||
      this.confirmPassword.invalid ||
      this.middleInit.invalid ||
      this.mobilePhone.invalid ||
      this.workPhone.invalid ||
      this.homePhone.invalid ||
      this.nokNumber.invalid ||
      this.dateofbirth.invalid
    ){
      return;
    }
    const dialogRef = this.dialog.open(DialogWindowComponent, {
      width: '400px',
      data: {title: "Is the Following correct?", confirm: 'YesNo', msg: this.newEmployee},
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) this.onSubmit();
    });
  }

  onSubmit() {
    console.log(this.newEmployee.userid);
    console.log(this.newEmployee.password);
    console.log(this.newEmployee.position);
    console.log(this.newEmployee.firstname);
    console.log(this.newEmployee.middleinitial);
    console.log(this.newEmployee.lastname);
    console.log(this.newEmployee.gender);
    console.log(this.newEmployee.dateofbirth);
    console.log(this.newEmployee.email);
    console.log(this.newEmployee.mobilephone);
    console.log(this.newEmployee.workphone);
    console.log(this.newEmployee.homephone);
    console.log(this.newEmployee.streetname1);
    console.log(this.newEmployee.streetname2);
    console.log(this.newEmployee.city);
    console.log(this.newEmployee.state);
    console.log(this.newEmployee.zipcode);
    console.log(this.newEmployee.country);
  }

  isDOBValid() {
    const dob = this.newEmployee.dateofbirth ? this.newEmployee.dateofbirth : "";
    const isValid = this.validator.validateDateOfBirth(dob);
    if (!isValid) {
      this.dateofbirth.setErrors({
        'invalidDate': true
      })
    }
  }

  isPasswordValid() {
    const msg = this.validator.validatePassword(this.newEmployee.password);
    switch(msg) {
      case 'containspace':
        this.password.setErrors({
          'containspace': true
        });
        break;
      case 'lessthan8char':
        this.password.setErrors({
          'lessthan8char': true
        });
        break;
      case 'mustcontainnum':
        this.password.setErrors({
          'mustcontainnum': true
        });
        break;
      case 'lowercaserequired':
        this.password.setErrors({
          'lowercaserequired': true
        });
        break;
      case 'uppercaserequired':
        this.password.setErrors({
          'uppercaserequired': true
        });
        break;
      case 'specialcharrequired':
        this.password.setErrors({
          'specialcharrequired': true
        });
        break;
    }
  }

  doPasswordsMatch(confirm: string) {
    if (this.newEmployee.password !== confirm) {
      this.confirmPassword.setErrors({
        'passwordsdonotmatch': true
      });
      this.password.setErrors({
        'passwordsdonotmatch': true
      });
    } else {
      this.password.reset(this.newEmployee.password);
      this.confirmPassword.reset(confirm);
    }
  }

  isUserIdValid() {
    const userid = this.newEmployee.userid;
    const illegalchar = userid.match(/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/);
    this.illegalChar = "";
    if (userid.includes(' ')) {
      this.userid.setErrors({
        'containSpace': true
      });
    } else if (userid.length < 5) {
      this.userid.setErrors({
        'lessthan5char': true
      });
    } else if (illegalchar){
      illegalchar.forEach((val) => {
        this.illegalChar += val + " "
      });
      this.userid.setErrors({
        'illegalchar': true
      });
    }
  }

}
