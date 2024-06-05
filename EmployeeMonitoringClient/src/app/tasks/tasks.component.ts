import { Component, OnInit } from '@angular/core';
import { Leader } from '../model/leader';
import { Task, TaskStatus } from '../model/task';
import { AuthService } from '../login/auth.service';
import { Router } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from './task.service';
import { WebSocketService } from '../web-socket.service';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css'
})
export class TasksComponent implements OnInit {
  leader: Leader | null = null;
  tasks: Task[] = [];
  newTask: Task = {
    id: 0,
    name: '',
    deadline: '',
    description: '',
    status: TaskStatus.UNASSIGNED
  };
  errorMessage: string | null = null;
  date: string = '';
  time: string = '';

  constructor(
    private authService: AuthService, 
    private taskService: TaskService, 
    private webSocketService: WebSocketService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.leader = this.authService.getUser() as Leader;
    if (!this.leader) {
      console.error('Leader data not found!');
    } else {
      this.loadTasks();

      this.webSocketService.getTaskUpdates().subscribe({
        next: (task) => this.loadTasks(),
        error: (error) => console.error('Error receiving task updates: ', error)
      });

      this.webSocketService.getAssignmentUpdates().subscribe({
        next: (newTask) => {
          const taskIndex = this.tasks.findIndex(task => task.id === newTask.id);
          if (taskIndex !== -1) {
            this.tasks[taskIndex] = newTask;
          } else {
            console.log('Task not found');
          }
        },
        error: (error) => console.error('Error receiving task updates: ', error)
      });
    }
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe({
      next: (data) => this.tasks = data,
      error: (error) => console.error('Error fetching tasks: ', error)
    });
  }

  openModal(): void {
    this.errorMessage = null;
    const modal = new (window as any).bootstrap.Modal(document.getElementById('taskModal'));
    modal.show();
  }
  
  validateTask(): boolean {
    const now = new Date();
    const taskDate = new Date(`${this.date} ${this.time}:00`);

    if (taskDate <= now) {
      this.errorMessage = 'The deadline must be in the future.';
      return false;
    }

    const hours = taskDate.getHours();
    if (hours < 6 || hours >= 18) {
      this.errorMessage = 'The dealine must be within working hours (06:00 AM to 06:00 PM).';
      return false;
    }

    return true;
  }

  public addTask(): void {
    if (!this.validateTask()) {
      return;
    }
    
    this.errorMessage = null;
    this.newTask.status = TaskStatus.UNASSIGNED;
    this.newTask.deadline = `${this.date} ${this.time}:00`;
    this.webSocketService.setLocalUpdate(true);
    this.taskService.addTask(this.newTask).subscribe({
      next: (task) => {
        this.tasks.push(task);
        this.newTask = { name: '', description: '', deadline: '', status: TaskStatus.UNASSIGNED };
        this.date = '';
        this.time = '';
        (window as any).bootstrap.Modal.getInstance(document.getElementById('taskModal')).hide();
      },
      error: (error) => {
        console.error('Error adding task:', error);
        this.errorMessage = 'Invalid task details';
      }
    })
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }

  logout(): void {
    this.authService.logout();
  }
}
