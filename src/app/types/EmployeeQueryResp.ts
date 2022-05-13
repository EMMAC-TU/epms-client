import { Employee } from "./Employee";

export interface EmployeeQueryResp {
     employee: Employee[];
     totalItemsMatched: number

}