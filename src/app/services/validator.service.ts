import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import { constants } from '../types/Constants';
import { Employee } from '../types/Employee';
import { EmployeeCreation } from '../types/EmployeeCreation';
import { Patient } from '../types/Patient';
import { PatientCreation } from '../types/PatientCreation';

/**
 * Class representing the "Validator Service"
 */
@Injectable({
  providedIn: 'root'
})
export class ValidatorService {

  constructor() { }

  /**
   * Function used to determine if the UserID is valid
   * @param {FormControl} form The form where this UserID is being entered into
   * @param {string} userid The value of the userid to check
   * @returns an empty list on success, sets an error message, or returns a list of invalid strings on failure
   */
  isUserIdValid(form: FormControl, userid?: string) {
    const id = userid ? userid : "";
    const illegalchar = id.match(constants.ILLEGAL_CHAR_REGEX);
    if (id.length === 0) {
      form.setErrors({
        'empty': true
      });
    } else if (id.includes(' ')) {
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

  /**
   * Function to create a request for the creation of a new employee or patient
   * @param {EmployeeCreation | PatientCreation} req The Patient or Employee information to send in the request
   * @returns The formatted request
   */
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

  /**
   * Function used to determine if the Gender is valid
   * @param req The request to update with the valid gender
   * @returns N/A
   */
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

  /**
   * Function used to determine if the email is valid
   * @param {string} email The email address to validate
   * @returns {boolean} true if it is a valid email, false otherwise
   */
  validateEmail(email: string): boolean{
    return !email
      .toLowerCase()
      .match(constants.EMAIL_REGEX)
  }

  /**
   * Function used to determine if the date of birth is valid
   * @param {string} dateofbirth The date of birth to validate
   * @returns {boolean} true if it is valid, false otherwise
   */
  validateDateOfBirth(dateofbirth: string): boolean {
    const MIN_DATE = new Date(1800,1,1);
    const MAX_DATE = new Date();
    const dob = new Date(dateofbirth);
    return dob >= MIN_DATE && dob <= MAX_DATE;
  }

  /**
   * Function used to determine if the end date is valid
   * @param {string} enddate The end date to validate
   * @returns {boolean} true if it is valid, false otherwise
   */
  validateEndDate(enddate: string): boolean {
    const MIN_DATE = new Date();
    const ENDDATE = new Date(enddate);
    return ENDDATE.getDate()+1 >= MIN_DATE.getDate();
  }

  /**
   * Function used to determine if the text is valid
   * @param {string} fields The text to validate
   * @returns {boolean, string} Tuple where the first element is true if it is valid a valid text, false otherwise.
   *  the second element will contain "" or contain the reason it is not valid
   */
  validateText(fields?: string): { isValid: boolean, message: string } {
    let isValid = true;
    let message = "";

    message = fields?.length === 0 ? "Cannot be Empty" : "";
    message = fields?.includes(' ') ? "Cannot contain space" : "";
    message = fields?.match(/\d/) ? "Cannot contain a number": "";

    isValid = message === "";
    
    return {isValid, message}
  }

  /**
   * Function to determine if a given password is valid
   * @param {string} password the password to validate
   * @returns Empty string if valid, or an error text stating why it isn't valid
   */
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
