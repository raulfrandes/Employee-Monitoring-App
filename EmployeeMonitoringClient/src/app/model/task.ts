export enum TaskStatus {
    UNASSIGNED = 'UNASSIGNED',
    ASSIGNED = 'ASSIGNED',
    COMPLETED = 'COMPLETED'
}

export interface Task {
    id?: number;
    name: string;
    description: string;
    deadline: string;
    status: TaskStatus;
}