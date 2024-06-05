import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Task } from '../model/task';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:8080/employee-monitoring/tasks';

  constructor(private http: HttpClient) {
   }

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/leader`);
  }

  getUnassignedTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/unassigned`);
  }

  addTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task);
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  assignTask(taskId: number, employeeId: number): Observable<Task> {
    return this.http.post<Task>(`http://localhost:8080/employee-monitoring/tasks/assign?taskId=${taskId}&employeeId=${employeeId}`, {});
  }

  getEmployeeTasks(employeeId: number): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/employee/${employeeId}`);
  }

  finishTask(taskId: number, employeeId: number): Observable<Task> {
    return this.http.patch<Task>(`${this.apiUrl}/finish?taskId=${taskId}&employeeId=${employeeId}`, null);
  }
}
