import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Leader } from '../model/leader';
import { Router } from '@angular/router';
import { AuthService } from '../login/auth.service';
import { WebSocketService } from '../web-socket.service';

@Component({
  selector: 'app-leader-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './leader-dashboard.component.html',
  styleUrl: './leader-dashboard.component.css',
  template: `<h1>Leader Dashboard</h1>`
})
export class LeaderDashboardComponent implements OnInit {
  leader: Leader | null = null;
  notifications: string[] = [];

  constructor(
    private router: Router,
    private authService: AuthService,
    private webSocketService: WebSocketService
  ) {}

  ngOnInit(): void {
    this.leader = this.authService.getUser() as Leader;
    if (!this.leader) {
      console.error('Leader data not found!');
    }

    this.webSocketService.getNotifications().subscribe({
      next: (notification) => {
        this.notifications.push(notification);
      },
      error: (error) => {
        console.error('Error fetching notifications: ', error);
      }
    });

    this.webSocketService.getLogoutUpdates().subscribe({
      next: (employeeId) => {
        this.notifications.push(`Employee with ID ${employeeId} has logged out.`);
      },
      error: (error) => {
        console.error('Error handling logout notification: ', error);
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
