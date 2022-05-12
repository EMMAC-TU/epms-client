import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { catchError, map, Observable, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { PERMISSIONS } from '../types/Permissions';

@Injectable({
  providedIn: 'root'
})
export class UpdatePatientGuard implements CanActivate {

  constructor(private auth: AuthService) {}

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
        return res.isAuthorized;
      })
    );
  }
  
}
