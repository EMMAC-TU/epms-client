export interface BackendQuery {
    dob?: string,
    lastname?: string,
    employeeid?: string,
    patientid?: string,
    limit?: number,
    page: number,
    sort: number
}