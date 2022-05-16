/**
 * Interface for a search query that will be sent to the backend
 * 
 */
export interface BackendQuery {
    dob?: string,
    lastname?: string,
    employeeid?: string,
    patientid?: string,
    limit?: number,
    page: number,
    sort: number
} 