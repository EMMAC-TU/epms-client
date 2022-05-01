import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PatientCreation } from '../types/PatientCreation';

@Component({
  selector: 'app-dialog-window',
  templateUrl: './dialog-window.component.html',
  styleUrls: ['./dialog-window.component.css']
})
export class DialogWindowComponent implements OnInit{
  fields: string[] = [];
  constructor(
    public dialogRef: MatDialogRef<DialogWindowComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PatientCreation,
  ) {}

  ngOnInit(): void {
    let format: string = '';
    Object.entries(this.data).forEach((value, index) => {
      if (value[1] !== ''){
        format = `${value[0]}: ${value[1]}`
        this.fields.push(format);

      }
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
