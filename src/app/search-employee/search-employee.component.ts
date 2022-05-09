import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-search-employee',
  templateUrl: './search-employee.component.html',
  styleUrls: ['./search-employee.component.css']
})
export class SearchEmployeeComponent implements OnInit {
  employeeid: String="";
  lastname: String="";
  dateofbirth: Date=new Date();  // Not sure if this should be initialized to null, or something else.


  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
  }

}
