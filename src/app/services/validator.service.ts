import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidatorService {

  constructor() { }

  validatePassword(password: string): string {

    if (password.includes(' ')){
      return 'Password cannot contain spaces';
    } else if (password.length < 8) {
      return 'Password length must be greater than or equal to 8'
    } else if (!(password.match('^(?=.*[0-9]).*$'))) {
      return 'Password requires a number';
    } else if (!(password.match('^(?=.*[a-z]).*$'))) {
      return 'Password requires a lowercase letter';
    } else if (!(password.match('^(?=.*[A-Z]).*$'))) {
      return 'Uppercase letter required';
    } else if (!(password.match('^(?=.*[!@#$%^&()+=]).*$'))) {
      return 'Password requires a special character';
    }
    return "";
  }
}
