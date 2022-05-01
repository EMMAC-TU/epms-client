import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  hide = true;
  @Output() isLogin = new EventEmitter<boolean>();
  
  constructor(private router: Router, private auth: AuthService) { }

  ngOnInit(): void {
  }

  login(username: string, password: string) {
    this.auth.login('deb123!', 'MockPassword123!');
  }

}
