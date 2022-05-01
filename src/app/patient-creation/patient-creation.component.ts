import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog'
import { DialogWindowComponent } from '../dialog-window/dialog-window.component';
import { PatientCreation } from '../types/PatientCreation';
@Component({
  selector: 'app-patient-creation',
  templateUrl: './patient-creation.component.html',
  styleUrls: ['./patient-creation.component.css']
})
export class PatientCreationComponent implements OnInit {
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
    address1: '',
    address2: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    nokfirstname: '',
    noklastname: '',
    nokphone: '',
    insurancename: '',
    memberid: '',
    groupnumber: '',
  }

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  openDialog() {
    // Check required fields
    if (!(this.newPatient.firstname && 
      this.newPatient.lastname && 
      this.newPatient.dateofbirth && 
      this.newPatient.email)){
      return;
    }
    const dialogRef = this.dialog.open(DialogWindowComponent, {
      width: '400px',
      data: this.newPatient,
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) this.onSubmit();
    });
  
  }

  onSubmit() {
    console.log(this.newPatient.firstname);
    console.log(this.newPatient.middleinitial);
    console.log(this.newPatient.lastname);
    console.log(this.newPatient.gender);
    console.log(this.newPatient.dateofbirth);
    console.log(this.newPatient.outpatient);
    console.log(this.newPatient.email);
    console.log(this.newPatient.mobilephone);
    console.log(this.newPatient.workphone);
    console.log(this.newPatient.homephone);
    console.log(this.newPatient.address1);
    console.log(this.newPatient.address2);
    console.log(this.newPatient.city);
    console.log(this.newPatient.state);
    console.log(this.newPatient.zipcode);
    console.log(this.newPatient.country);
    console.log(this.newPatient.nokfirstname);
    console.log(this.newPatient.noklastname);
    console.log(this.newPatient.nokphone);
    console.log(this.newPatient.insurancename);
    console.log(this.newPatient.memberid);
    console.log(this.newPatient.groupnumber);
  }

}
