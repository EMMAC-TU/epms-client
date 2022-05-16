import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { catchError, map, Observable, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { PERMISSIONS } from '../types/Permissions';

/**
 * Class representing the admin guard. Used to determine if a user is allowed to execute an admin action
 * Will throw an error, open a snackBar indicating they don't have authoriation, 
 * and return the user to the homescreen if that is the case.
 */
@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private auth: AuthService, private route: Router, private _snackBar: MatSnackBar) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      
    return this.auth.isAuthorized([PERMISSIONS.ADMIN])
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
