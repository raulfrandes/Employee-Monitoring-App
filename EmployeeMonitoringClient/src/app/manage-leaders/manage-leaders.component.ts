import { Component, OnInit } from '@angular/core';
import { Leader } from '../model/leader';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../login/auth.service';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-manage-leaders',
  standalone: true,
  imports: [NgIf, FormsModule, NgFor],
  templateUrl: './manage-leaders.component.html',
  styleUrl: './manage-leaders.component.css'
})
export class ManageLeadersComponent implements OnInit {
  leaders: Leader[] = [];
  newLeader: Leader = { id: 0, username: '', password: '', name: '', telephone: '', email: '', jobTitle: '', department: '', birthDate: '', leadershipRole: '' };
  selectedLeader: Leader = { id: 0, username: '', password: '', name: '', telephone: '', email: '', jobTitle: '', department: '', birthDate: '', leadershipRole: '' };
  errorMessage: string | null = null;
  date: string = '';
  time: string = '';
  apiUrl: string = 'http://localhost:8080/employee-monitoring/leaders';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadLeaders();
  }

  loadLeaders(): void {
    this.http.get<Leader[]>(this.apiUrl).pipe(
      catchError(error => {
        this.errorMessage = 'Failed to load leaders';
        return throwError(() => new Error(error));
      })
    ).subscribe(data => {
      this.leaders = data;
    });
  }

  addLeader(): void {
    this.errorMessage = '';
    this.newLeader.birthDate = `${this.date}T${this.time}:00`
    console.log(this.newLeader);
    this.http.post(this.apiUrl, this.newLeader).pipe(
      catchError(error => {
        this.errorMessage = 'Failed to add leader';
        return throwError(() => Error(error));
      })
    ).subscribe(() => {
      this.loadLeaders();
      this.newLeader = { id: 0, username: '', password: '', name: '', telephone: '', email: '', jobTitle: '', department: '', birthDate: '', leadershipRole: '' };
      this.date = '';
      this.time = '';
      (window as any).bootstrap.Modal.getInstance(document.getElementById('addLeaderModal')).hide();
    });
  }

  updateLeader(): void {
    this.errorMessage = '';
    this.selectedLeader.birthDate = `${this.date}T${this.time}`
    this.http.post(this.apiUrl, this.selectedLeader).pipe(
      catchError(error => {
        this.errorMessage = 'Failed to update leader';
        return throwError(() => Error(error));
      })
    ).subscribe(() => {
      this.loadLeaders();
      this.selectedLeader = { id: 0, username: '', password: '', name: '', telephone: '', email: '', jobTitle: '', department: '', birthDate: '', leadershipRole: '' };
      this.date = '';
      this.time = '';
      (window as any).bootstrap.Modal.getInstance(document.getElementById('updateLeaderModal')).hide();
    });
  }

  deleteLeader(id: number): void {
    this.http.delete(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        this.errorMessage = 'Failed to delete leader';
        return throwError(() => Error(error));
      })
    ).subscribe(() => {
      this.loadLeaders();
    });
  }

  openAddModal(): void {
    this.date = '';
    this.time = '';
    const modal = new (window as any).bootstrap.Modal(document.getElementById('addLeaderModal'));
    modal.show();
  }

  openUpdateModal(leader: any): void {
    this.selectedLeader = { ...leader };
    this.date = this.selectedLeader.birthDate.split('T')[0];
    this.time = this.selectedLeader.birthDate.split('T')[1];
    const modal = new (window as any).bootstrap.Modal(document.getElementById('updateLeaderModal'));
    modal.show();
  }

  formatBirthDate(birthDate: string): string {
    return birthDate.split('T')[0];
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }

  logout(): void {
    this.authService.logout();
  }

}
