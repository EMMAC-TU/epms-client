import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.css']
})
export class UpdatePasswordComponent implements OnInit {

  hide = false;
  password = "";
  
  constructor() { }

  ngOnInit(): void {
  }

  updatePassword() {

  }

  confirmPassword() {

  }

}
