import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UpdatePasswordComponent } from '../update-password/update-password.component';

/**
 * Class representing the Options page
 */
@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.css']
})
export class OptionsComponent implements OnInit {

  constructor(
    private auth: AuthService, 
    private router: Router,
    private dialog: MatDialog) { }

  ngOnInit(): void {
  }

    /**
   * This function will perform the logout of the EHRS. It will then redirect to the login page.
   * @returns N/A
   */
  logout() {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }

  /**
   * This function will create and display the update password dialog-window.
   */
  updatePassword() {
    let dialogRef = this.dialog.open(UpdatePasswordComponent, {
      height: '600px',
      width: '600px',
      data: {}
    });
  }

}
