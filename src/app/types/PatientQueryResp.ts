import { Patient } from "./Patient";

/**
 * An interface that defines what will be recieved from the backend during a search query
 */
export interface PatientQueryResp {
     patient: Patient[];
     totalItemsMatched: number
} 