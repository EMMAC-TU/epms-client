import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { CookieHelperService } from '../services/cookie-helper.service';

/**
 * Class representing the auth guard. Used to determine if a user is logged in
 * If they are not it will redirect the user to the login screen.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    if (this.auth.isLoggedIn()){
      return true;
    }
    this.router.navigateByUrl('/login');
    return false;
  }
  
}
