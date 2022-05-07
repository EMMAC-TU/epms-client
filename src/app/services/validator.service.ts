import { Injectable } from '@angular/core';
import { EmployeeCreation } from '../types/EmployeeCreation';
import { PatientCreation } from '../types/PatientCreation';

@Injectable({
  providedIn: 'root'
})
export class ValidatorService {

  constructor() { }

  createRegistrationRequest(req: EmployeeCreation | PatientCreation) {
    let obj: any = {};
    Object.entries(req).forEach((val) => {
      if (val[1] !== '') {
        obj[val[0]] = val[1];
      }
    });
    return obj
  }

  validateEmail(email: string): boolean{
    return !email
      .toLowerCase()
      .match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
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
