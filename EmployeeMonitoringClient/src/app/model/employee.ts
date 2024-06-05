import { User } from "./user";

export interface Employee extends User{
    name: string;
    telephone: string;
    email: string;
    jobTitle: string;
    department: string;
    birthDate: string;
}