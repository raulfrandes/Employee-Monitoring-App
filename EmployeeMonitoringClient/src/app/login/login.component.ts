import { CommonModule, NgClass, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginRequest } from '../model/login-request';
import { Router } from '@angular/router';
import { LoginResponse } from '../model/login-response';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, NgIf, NgFor, NgClass, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  public loginRequest: LoginRequest = {
    username: '',
    password: ''
  };
  public errorMessage: string = '';

  constructor(
    private router: Router, 
    private authService: AuthService
  ) {}

  public onLogin(): void {
    if (!this.loginRequest.username || !this.loginRequest.password) {
      this.errorMessage = 'Username and password are required.';
      return;
    }

    this.authService.login(this.loginRequest).subscribe({
      next: (response: LoginResponse) => {
        if ('leadershipRole' in response.user) {
          this.router.navigate(['/leader-dashboard']);
        } else if ('name' in response.user) {
          this.router.navigate(['/employee-dashboard']);        
        } else {
          this.router.navigate(['/admin-dashboard'])
        }
      },
      error: (error) => {
        this.errorMessage = "Wrong credentials!";
      }
    });
  }
}
