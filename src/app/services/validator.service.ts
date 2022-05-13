import { Injectable } from '@angular/core';
import { EmployeeCreation } from '../types/EmployeeCreation';
import { PatientCreation } from '../types/PatientCreation';
import { constants } from '../types/Constants';

@Injectable({
  providedIn: 'root'
})
export class ValidatorService {

  constructor() { }

  createRegistrationRequest(req: EmployeeCreation | PatientCreation) {
    this.validateGender(req);
    let obj: any = {};
    Object.entries(req).forEach((val) => {
      if (val[1] !== '' && val[1] !== undefined) {
        obj[val[0]] = val[1];
      }
    });
    return obj
  }

  validateEmail(email: string): boolean{
    return !email
      .toLowerCase()
      .match(constants.EMAIL_REGEX)
  }

  validateDateOfBirth(dateofbirth: string): boolean {
    const MIN_DATE = new Date(1800,1,1);
    const MAX_DATE = new Date();
    const dob = new Date(dateofbirth);
    return dob >= MIN_DATE && dob <= MAX_DATE;
  }

  validateText(fields?: string): { isValid: boolean, message: string } {
    let isValid = true;
    let message = "";

    message = fields?.length === 0 ? "Cannot be Empty" : "";
    message = fields?.includes(' ') ? "Cannot contain space" : "";
    message = fields?.match(/\d/) ? "Cannot contain a number": "";

    isValid = message === "";
    
    return {isValid, message}
  }

  validatePassword(password: string): string {
    if (password.includes(' ')){
      return 'Password cannot contain a space';
    } else if (password.length < constants.MIN_PWD_LEN) {
      return 'Password must be greater than 8 characters';
    } else if (!(password.match('^(?=.*[0-9]).*$'))) {
      return 'Password must contain a number';
    } else if (!(password.match('^(?=.*[a-z]).*$'))) {
      return 'Password must contain a lowercase character';
    } else if (!(password.match('^(?=.*[A-Z]).*$'))) {
      return 'Password must contain a uppercase character';
    } else if (!(password.match('^(?=.*[!@#$%^&()+=]).*$'))) {
      return 'Password must contain a special character';
    }
    return "";
  }
}
