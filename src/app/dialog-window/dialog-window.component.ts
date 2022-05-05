import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EmployeeCreation } from '../types/EmployeeCreation';
import { PatientCreation } from '../types/PatientCreation';

@Component({
  selector: 'app-dialog-window',
  templateUrl: './dialog-window.component.html',
  styleUrls: ['./dialog-window.component.css']
})
export class DialogWindowComponent implements OnInit{
  fields: string[] = [];
  isString: boolean = false;
  title: string = ""
  typeConfirmation: string = "";
  constructor(
    public dialogRef: MatDialogRef<DialogWindowComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {title: string, confirm: "YesNo" | "Ok", msg: PatientCreation | EmployeeCreation | String },
  ) {}

  ngOnInit(): void {
    this.title = this.data.title;
    this.typeConfirmation = this.data.confirm;
    
    if (this.data.msg instanceof String) {
      this.isString = true;
    } else {
      let format: string = '';
      Object.entries(this.data.msg).forEach((value, index) => {
        if (value[1] !== ''){
          format = `${value[0]}: ${value[1]}`
          this.fields.push(format);

        }
      });
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
