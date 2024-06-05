import { CommonModule, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Employee } from '../model/employee';
import { AuthService } from '../login/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ClockUpComponent } from "../clock-up/clock-up.component";

@Component({
    selector: 'app-employee-dashboard',
    standalone: true,
    templateUrl: './employee-dashboard.component.html',
    styleUrl: './employee-dashboard.component.css',
    imports: [CommonModule, NgIf, FormsModule, ClockUpComponent]
})
export class EmployeeDashboardComponent implements OnInit {
  employee: Employee | null = null;
  hasClockedUp: boolean = false;

  constructor(
    private authService: AuthService, 
    private router: Router
  ) {}

  ngOnInit(): void {
    this.employee = this.authService.getUser() as Employee;
    if (!this.employee) {
      this.router.navigate(['/login']);
    } else {
      this.checkClockUpStatus();
    }
  }

  checkClockUpStatus(): void {
    this.hasClockedUp = !!this.authService.getClockedUp();
    if (!this.hasClockedUp) {
      this.router.navigate(['/clock-up']);
    }
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }

  logout(): void {
    this.authService.logout();
  }
}
