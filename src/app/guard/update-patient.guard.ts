import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { catchError, map, Observable, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { PERMISSIONS } from '../types/Permissions';

/**
 * Class representing the update patient guard. Used to determine if a user is allowed to update a patient record.
 * If they are not allowed it will open a snackBar indicating they don't have authoriation, 
 * and return the user to the homescreen.
 */
@Injectable({
  providedIn: 'root'
})
export class UpdatePatientGuard implements CanActivate {

  constructor(private auth: AuthService, private route: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return this.auth.isAuthorized([PERMISSIONS.ADMIN, PERMISSIONS.DOCTOR, PERMISSIONS.NURSE, PERMISSIONS.RECEPTIONIST])
    .pipe(
      catchError((err) => {
        return throwError(() => new Error());
      }),
      map((value) => {
        const res = value.body as any;
        if (res.isAuthorized) return true;
        this.route.navigateByUrl('/');
        window.alert("You are not authorized.");
        return false;
      })
    );
  }
  
}
