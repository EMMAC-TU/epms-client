import { Component, OnInit, Output } from '@angular/core';

/**
 * Class representing the home page
 */
@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  // Class variables
  @Output() isLogin : boolean = true;
  dataSource = [
    {position: 'Administrator', ViewPatientInfo: true, UpdatePatientInfo: true, CreatePatientRecord: true, SearchPatientRecord: true,
                                ViewEmployeeInfo: true, UpdateEmployeeInfo: true, CreateEmployeeRecord: true, SearchEmployeeRecord: true,
                                UpdatePassword: true, Login: true, Logout: true },
    {position: 'Receptionist', ViewPatientInfo: true, UpdatePatientInfo: true, CreatePatientRecord: true, SearchPatientRecord: true,
                                ViewEmployeeInfo: false, UpdateEmployeeInfo: false, CreateEmployeeRecord: false, SearchEmployeeRecord: false,
                                UpdatePassword: true, Login: true, Logout: true },
    {position: 'Doctor', ViewPatientInfo: true, UpdatePatientInfo: true, CreatePatientRecord: false, SearchPatientRecord: true,
                          ViewEmployeeInfo: false, UpdateEmployeeInfo: false, CreateEmployeeRecord: false, SearchEmployeeRecord: false,
                            UpdatePassword: false, Login: false, Logout: false},
    {position: 'Nurse', ViewPatientInfo: true, UpdatePatientInfo: true, CreatePatientRecord: false, SearchPatientRecord: true,
                        ViewEmployeeInfo: false, UpdateEmployeeInfo: false, CreateEmployeeRecord: false, SearchEmployeeRecord: false,
                        UpdatePassword: true, Login: true, Logout: true},
    {position: 'Vendor', ViewPatientInfo: true, UpdatePatientInfo: false, CreatePatientRecord: false, SearchPatientRecord: true,
                        ViewEmployeeInfo: false, UpdateEmployeeInfo: false, CreateEmployeeRecord: false, SearchEmployeeRecord: false,
                        UpdatePassword: true, Login: true, Logout: true},
    {position: 'Accountant', ViewPatientInfo: true, UpdatePatientInfo: false, CreatePatientRecord: false, SearchPatientRecord: true,
                          ViewEmployeeInfo: false, UpdateEmployeeInfo: false, CreateEmployeeRecord: false, SearchEmployeeRecord: false,
                          UpdatePassword: true, Login: true, Logout: true},
  ];
  displayedColumns: string[] = [
    'Position', 'View Patient Info', 'Update Patient Info', 'Create Patient Record', 'Search Patient Record',
    'View Employee Info', 'Update Employee Info', 'Create Employee Record', 'Search Employee Record',
    'Update Password', 'Login', 'Logout'
  ]
  constructor() { }

  ngOnInit(): void {
  }

}
