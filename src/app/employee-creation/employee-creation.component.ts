import { Component, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-employee-creation',
  templateUrl: './employee-creation.component.html',
  styleUrls: ['./employee-creation.component.css']
})
export class EmployeeCreationComponent implements OnInit {
  positions: string[] = ['Administrator', 'Doctor', 'Nurse', 'Vendor', 'Receptionist'];
  @Output() isLogin : boolean = true;

  constructor() { }

  ngOnInit(): void {
  }

}
