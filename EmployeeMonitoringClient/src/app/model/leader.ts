import { Employee } from "./employee";

export interface Leader extends Employee {
    leadershipRole: string;
}