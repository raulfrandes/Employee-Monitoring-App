import { Employee } from "./employee";
import { Leader } from "./leader";

export interface LoginResponse {
    token: string;
    user: Employee | Leader;
}