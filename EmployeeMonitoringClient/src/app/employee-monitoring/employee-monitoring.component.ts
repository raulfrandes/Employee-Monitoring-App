import { Component, OnInit } from '@angular/core';
import { Leader } from '../model/leader';
import { Task } from '../model/task';
import { AuthService } from '../login/auth.service';
import { Router } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { Session } from '../model/session';
import { WebSocketService } from '../web-socket.service';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../tasks/task.service';
import { SessionService } from './session.service';

@Component({
  selector: 'app-employee-monitoring',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule],
  templateUrl: './employee-monitoring.component.html',
  styleUrl: './employee-monitoring.component.css'
})
export class EmployeeMonitoringComponent implements OnInit {
  leader: Leader | null = null;
  sessions: Session[] = [];
  errorMessage: string | null = null;
  unassignedTasks: Task[] = [];
  selectedTask: Task | null = null;

  constructor(
    private authService: AuthService,
    private webSocketService: WebSocketService,
    private router: Router,
    private taskService: TaskService,
    private sessionService: SessionService
  ) {}

  ngOnInit(): void {
    this.leader = this.authService.getUser() as Leader;
    if (!this.leader) {
      console.error('Leader data not found!');
    }

    this.loadEmployees();
    this.loadUnassignedTasks();
    
    this.webSocketService.getLogoutUpdates().subscribe({
      next: (employeeId) => {
        this.sessions = this.sessions.filter(session => session.loggedInEmployee.id !== employeeId);
      },
      error: (error) => {
        console.error('Error handling logout update: ', error);
      }
    });

    this.webSocketService.getTaskUpdates().subscribe({
      next: (task) => {
        this.loadUnassignedTasks();
      },
      error: (error) => {
        console.error('Error fetching task updates: ', error);
      }
    });

    this.webSocketService.getClockUpUpdates().subscribe({
      next: (session) => {
        this.sessions.push(session);
      },
      error: (error) => {
        console.error('Error receiving clock-up updates: ', error);
      }
    });
  }

  loadUnassignedTasks(): void {
    this.taskService.getUnassignedTasks().subscribe({
      next: (tasks) => {
        this.unassignedTasks = tasks;
      },
      error: (error) => {
        console.error('Error fetching unassigned tasks: ', error);
      }
    });
  }

  loadEmployees(): void {
    this.sessionService.getSessions().subscribe({
      next: (sessions) => {
        this.sessions = sessions;
      },
      error: (error) => {
        console.error('Error fetching sessions: ', error);
      }
    });
  }

  assignTask(employeeId: number): void {
    if (!this.selectedTask) {
      this.errorMessage = 'No task selected';
      return;
    }

    this.taskService.assignTask(this.selectedTask.id!, employeeId).subscribe({
      next: (task) => {
        this.selectedTask = null;
        this.loadUnassignedTasks();
        this.webSocketService.setLocalUpdate(true);
      },
      error: (error) => {
        console.error('Error assigning task:', error);
        this.errorMessage = 'Failed to assign task';
      }
    });
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }

  logout(): void {
    this.authService.logout();
  }
}
