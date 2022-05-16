import { Employee } from "./Employee";

/**
 * Interface that defines the response that is recieved from the backend during a search query
 */
export interface EmployeeQueryResp {
     employee: Employee[];
     totalItemsMatched: number

} 