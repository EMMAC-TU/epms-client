import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { catchError, map, Observable, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { PERMISSIONS } from '../types/Permissions';

/**
 * Class representing the patient guard. Used to determine if a user is allowed to create a patient
 * If they don't have permission it will throw an error, open a snackBar indicating they don't have authoriation, 
 * and return the user to the homescreen.
 */
@Injectable({
  providedIn: 'root'
})
export class CreatePatientGuard implements CanActivate {
  constructor(private auth: AuthService, private route: Router, private _snackBar: MatSnackBar) {}
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return this.auth.isAuthorized([PERMISSIONS.ADMIN, PERMISSIONS.RECEPTIONIST])
    .pipe(
      catchError((err) => {
        return throwError(() => new Error());
      }),
      map((value) => {
        const res = value.body as any;
        if (res.isAuthorized) return true;
        this.route.navigateByUrl('/');
        this._snackBar.open('Not Authorized', 'Confirm', {duration: 5000});
        return false;
      })
    );
  }
  
}
