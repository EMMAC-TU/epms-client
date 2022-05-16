/**
 * An interface that defines what fields can be filled out during the creation of a patient
 */
export interface PatientCreation {
    height?: number;
    weight?: number;
    firstname?: string;
    lastname?: string;
    middleinitial?: string;
    outpatient?: boolean;
    dateofbirth?: string;
    gender?: string;
    email?: string;
    homephone?: string;
    mobilephone?: string;
    workphone?: string;
    insurance_companyname?: string,
    insurance_memberid?: string,
    insurance_groupnumber?: string,
    streetname1?: string;
    city?: string;
    state?: string;
    zipcode?: string;
    country?: string;
    streetname2?: string;
    nok_mobilephone?: string,
    nok_firstname?: string,
    nok_lastname?: string,
}