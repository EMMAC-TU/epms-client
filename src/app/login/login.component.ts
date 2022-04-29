import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  hide = true;
  @Output() isLogin = new EventEmitter<boolean>();
  
  constructor(private router: Router) { }

  ngOnInit(): void {

  }

}
