import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogWindowComponent } from '../dialog-window/dialog-window.component';
import { EmployeeCreation } from '../types/EmployeeCreation';

@Component({
  selector: 'app-employee-creation',
  templateUrl: './employee-creation.component.html',
  styleUrls: ['./employee-creation.component.css']
})
export class EmployeeCreationComponent implements OnInit {
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

  constructor(private dialog: MatDialog) { }

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

}
