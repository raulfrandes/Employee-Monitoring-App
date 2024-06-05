import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Employee } from '../model/employee';
import { TaskService } from '../tasks/task.service';
import { Router } from '@angular/router';
import { AuthService } from '../login/auth.service';
import { Task } from '../model/task';
import { WebSocketService } from '../web-socket.service';

@Component({
  selector: 'app-employee-tasks',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule],
  templateUrl: './employee-tasks.component.html',
  styleUrl: './employee-tasks.component.css'
})
export class EmployeeTasksComponent implements OnInit {
  employee: Employee | null = null;
  tasks: Task[] = [];
  selectedTask: Task | null = null;
  errorMessage: string | null = null;

  constructor(
    private authService: AuthService, 
    private taskService: TaskService,
    private router: Router,
    private webSocketService: WebSocketService
  ) {}

  ngOnInit(): void {
    this.employee = this.authService.getUser() as Employee;
    if (!this.employee) {
      console.error('Employee data not found!');
    } else {
      this.loadTasks();

      this.webSocketService.getAssignmentUpdates().subscribe({
        next: (newTask) => this.loadTasks(),
        error: (error) => console.error('Error receiving task updates: ', error)
      });
    }
  }

  loadTasks(): void {
    this.taskService.getEmployeeTasks(this.employee?.id!).subscribe({
      next: (data) => this.tasks = data,
      error: (error) => console.error('Error fetching tasks: ', error)
    });
  }

  completeTask(task: Task): void {
    if (this.employee) {
      this.taskService.finishTask(task.id!, this.employee.id).subscribe({
        next: (task) => {
          this.tasks = this.tasks.filter(t => t.id !== task.id);
        },
        error: (error) => {
          console.error('Error finishing task: ', error);
        }
      });
    }
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }

  logout(): void {
    this.authService.logout();
  }
}
