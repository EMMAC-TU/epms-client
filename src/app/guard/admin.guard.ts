import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { catchError, map, Observable, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { PERMISSIONS } from '../types/Permissions';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private auth: AuthService, private route: Router) {}
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
        return res.isAuthorized;
      })
    );
  }

  
  
}
