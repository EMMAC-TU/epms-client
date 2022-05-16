/**
 * Interface that defines what fields can be sent to create an employee
 */
export interface EmployeeCreation {
    userid?: string;
    password?: string;
    firstname?: string;
    middleinitial?: string;
    lastname?: string;
    gender?: string;
    dateofbirth?: string;
    enddate?: string;
    email?: string;
    position?: string;
    streetname1?: string,
    city?: string,
    state?: string,
    zipcode?: string,
    country?: string
    streetname2?: string,
    homephone?: string;
    mobilephone?: string;
    workphone?: string;
}