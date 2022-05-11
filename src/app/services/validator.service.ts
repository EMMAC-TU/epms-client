import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Employee } from '../types/Employee';
import { EmployeeCreation } from '../types/EmployeeCreation';
import { Patient } from '../types/Patient';
import { PatientCreation } from '../types/PatientCreation';

@Injectable({
  providedIn: 'root'
})
export class ValidatorService {

  constructor() { }

  isUserIdValid(form: FormControl, userid?: string) {
    const id = userid ? userid : "";
    const illegalchar = id.match(/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/);
    if (id.includes(' ')) {
      form.setErrors({
        'containSpace': true
      });
    } else if (id.length < 5) {
      form.setErrors({
        'lessthan5char': true
      });
    } else if (illegalchar){
      form.setErrors({
        'illegalchar': true
      });
      return illegalchar;
    }
    return [];
  }

  createRegistrationRequest(req: EmployeeCreation | PatientCreation) {
    let obj: any = {};
    Object.entries(req).forEach((val) => {
      if (val[1] !== '' && val[1] !== undefined) {
        obj[val[0]] = val[1];
      }
    });
    return obj
  }

  validateGender(req: EmployeeCreation | PatientCreation | Patient | Employee) {
    if (!req.gender) return;
    switch(req.gender) {
      case 'Male':
        req.gender = "M";
        break;
      case 'Female':
        req.gender = 'F';
        break;
      case 'Other':
        req.gender = 'O';
        break;
    }
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

  validateEndDate(enddate: string): boolean {
    const MIN_DATE = new Date();
    const ENDDATE = new Date(enddate);
    return ENDDATE.getDate()+1 >= MIN_DATE.getDate();
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
    } else if (password.length < 8) {
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
