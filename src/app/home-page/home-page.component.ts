import { Component, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  @Output() isLogin : boolean = true;
  
  constructor() { }

  ngOnInit(): void {
  }

}
