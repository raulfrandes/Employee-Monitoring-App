import { Employee } from "./employee";

export interface Session {
    id: number;
    arrivalTime: string;
    loggedInEmployee: Employee;
}