import { Patient } from "./Patient";

export interface PatientQueryResp {
     patient: Patient[];
     totalItemsMatched: number
} 