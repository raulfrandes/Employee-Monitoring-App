import { Component } from '@angular/core';
import { AuthService } from '../login/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-clock-up',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './clock-up.component.html',
  styleUrl: './clock-up.component.css'
})
export class ClockUpComponent {
  errorMessage: string | null = null;
  arrivalTime: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  clockUp(): void {
    if (!this.arrivalTime) {
      this.errorMessage = 'Arrival time is required.';
      return;
    }

    const employee = this.authService.getUser();
    if (!employee) {
      this.errorMessage = 'User not logged in.';
      return;
    }

    this.authService.clockUp(employee.id, this.arrivalTime).subscribe({
      next: () => {
        this.router.navigate(['/employee-dashboard']);
      },
      error: (error) => {
        console.error('Clock-up error:', error);
        this.errorMessage = 'Invalid arrival time.';
      }
    });
  }
}
