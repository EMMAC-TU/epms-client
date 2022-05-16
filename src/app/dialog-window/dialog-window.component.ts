import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Employee } from '../types/Employee';
import { EmployeeCreation } from '../types/EmployeeCreation';
import { Patient } from '../types/Patient';
import { PatientCreation } from '../types/PatientCreation';

/**
 * Class representing a dialog-window
 */
@Component({
  selector: 'app-dialog-window',
  templateUrl: './dialog-window.component.html',
  styleUrls: ['./dialog-window.component.css']
})

export class DialogWindowComponent implements OnInit{
  // Variables for use by this class
  fields: string[] = [];
  isString: boolean = false;
  title: string = ""
  typeConfirmation: string = "";
  
  constructor(
    public dialogRef: MatDialogRef<DialogWindowComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      title: string, 
      confirm: "YesNo" | "Ok",
      msg: PatientCreation | EmployeeCreation | Employee | Patient | String },
  ) {}
  
  /**
   * Function to execute when class is initialized. Creates the dialog-window.
   * @returns N/A
   */
  ngOnInit(): void {
    // Set variables for use in the dialog-window
    this.title = this.data.title;
    this.typeConfirmation = this.data.confirm;
    
    if (typeof this.data.msg === 'string') {
      this.isString = true;
    } else {
      let format: string = '';
      Object.entries(this.data.msg).forEach((value, index) => {
        // Loop through the messages and format each one, and add it to the fields array
        if (value[1] !== '' && value[1] !== undefined && value[0] !== 'password'){
          format = `${value[0]}: ${value[1]}`
          this.fields.push(format);

        }
      });
    }
  }

  /**
   * Function to run when the user clicks "no" on the dialog window. Just closes the dialog-window.
   */
  onNoClick(): void {
    this.dialogRef.close();
  }
}
