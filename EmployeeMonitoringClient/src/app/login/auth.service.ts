import { Injectable } from '@angular/core';
import { Leader } from '../model/leader';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { LoginResponse } from '../model/login-response';
import { LoginRequest } from '../model/login-request';
import { Employee } from '../model/employee';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'auth-token';
  private userKey = 'auth-user';

  constructor(private http: HttpClient, private router: Router) {}

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined';
  }

  login(loginRequest: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>('http://localhost:8080/employee-monitoring/users/login', loginRequest).pipe(
      tap(response => {
        if (response.token && this.isBrowser()) {
          sessionStorage.setItem(this.tokenKey, response.token);
          sessionStorage.setItem(this.userKey, JSON.stringify(response.user));
        }
      })
    );
  }

  getUser(): Leader | Employee | User | null {
    if (!this.isBrowser()) {
      return null;
    }
    const userJson = sessionStorage.getItem(this.userKey);
    return userJson ? JSON.parse(userJson) : null;
  }

  getToken(): string | null {
    if (!this.isBrowser()) {
      return null;
    }
    return sessionStorage.getItem(this.tokenKey);
  }

  getClockedUp(): string | null {
    if (!this.isBrowser()) {
      return null;
    }
    return sessionStorage.getItem('hasClockedUp');
  }

  logout(): void {
    if (this.isBrowser()) {
      const user = this.getUser();
      if (user && 'id' in user && !('leadershipRole' in user)) {
        this.http.delete(`http://localhost:8080/employee-monitoring/sessions/logout/${user.id}`).subscribe({
          next: () => {
            sessionStorage.removeItem(this.userKey);
            sessionStorage.removeItem(this.tokenKey);
            sessionStorage.removeItem('hasClockedUp');
            this.router.navigate(['/login']);
          },
          error: (error) => {
            console.error('Logout error:', error);
            sessionStorage.removeItem(this.userKey);
            sessionStorage.removeItem(this.tokenKey);
            sessionStorage.removeItem('hasClockedUp');
            this.router.navigate(['/login']);
          }
        });
      } else {
        sessionStorage.removeItem(this.userKey);
        sessionStorage.removeItem(this.tokenKey);
        sessionStorage.removeItem('hasClockedUp');
        this.router.navigate(['/login']);
      }
    }
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  clockUp(employeeId: number, arrivalTime: string): Observable<any> {
    return this.http.post<any>('http://localhost:8080/employee-monitoring/sessions/clock-up', {}, {
      params: {
        employeeId: employeeId.toString(),
        arrivalTime: arrivalTime
      }
    }).pipe(
      tap(response => {
        if (this.isBrowser()) {
          sessionStorage.setItem('hasClockedUp', 'true');
        }
      })
    );
  }
}
