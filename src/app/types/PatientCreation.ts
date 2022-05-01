export interface PatientCreation {
    firstname: string;
    middleinitial: string;
    lastname: string;
    gender: string;
    dateofbirth?: Date;
    outpatient: boolean;
    email: string;
    mobilephone: string;
    workphone: string;
    homephone: string;
    address1: string;
    address2: string;
    city: string;
    state: string;
    zipcode: string;
    country: string;
    nokfirstname: string;
    noklastname: string;
    nokphone: string;
    insurancename: string;
    memberid: string;
    groupnumber: string;
}