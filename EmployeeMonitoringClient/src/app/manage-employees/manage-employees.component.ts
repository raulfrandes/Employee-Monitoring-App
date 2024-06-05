import { Component, OnInit } from '@angular/core';
import { Employee } from '../model/employee';
import { HttpClient } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';
import { AuthService } from '../login/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manage-employees',
  standalone: true,
  imports: [NgIf, FormsModule, NgFor],
  templateUrl: './manage-employees.component.html',
  styleUrl: './manage-employees.component.css'
})
export class ManageEmployeesComponent implements OnInit {
  employees: Employee[] = [];
  newEmployee: Employee = { id: 0, username: '', password: '', name: '', telephone: '', email: '', jobTitle: '', department: '', birthDate: '' };
  selectedEmployee: Employee = { id: 0, username: '', password: '', name: '', telephone: '', email: '', jobTitle: '', department: '', birthDate: '' };
  errorMessage: string | null = null;
  date: string = '';
  time: string = '';
  apiUrl: string = 'http://localhost:8080/employee-monitoring/employees';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.http.get<Employee[]>(this.apiUrl).pipe(
      catchError(error => {
        this.errorMessage = 'Failed to load employees';
        return throwError(() => new Error(error));
      })
    ).subscribe(data => {
      this.employees = data;
    });
  }

  addEmployee(): void {
    this.errorMessage = '';
    this.newEmployee.birthDate = `${this.date}T${this.time}:00`
    console.log(this.newEmployee);
    this.http.post(this.apiUrl, this.newEmployee).pipe(
      catchError(error => {
        this.errorMessage = 'Failed to add employee';
        return throwError(() => Error(error));
      })
    ).subscribe(() => {
      this.loadEmployees();
      this.newEmployee = { id: 0, username: '', password: '', name: '', telephone: '', email: '', jobTitle: '', department: '', birthDate: '' };
      this.date = '';
      this.time = '';
      (window as any).bootstrap.Modal.getInstance(document.getElementById('addEmployeeModal')).hide();
    });
  }

  updateEmployee(): void {
    this.errorMessage = '';
    this.selectedEmployee.birthDate = `${this.date}T${this.time}`
    this.http.post(this.apiUrl, this.selectedEmployee).pipe(
      catchError(error => {
        this.errorMessage = 'Failed to update employee';
        return throwError(() => Error(error));
      })
    ).subscribe(() => {
      this.loadEmployees();
      this.selectedEmployee = { id: 0, username: '', password: '', name: '', telephone: '', email: '', jobTitle: '', department: '', birthDate: '' };
      this.date = '';
      this.time = '';
      (window as any).bootstrap.Modal.getInstance(document.getElementById('updateEmployeeModal')).hide();
    });
  }

  deleteEmployee(id: number): void {
    this.http.delete(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        this.errorMessage = 'Failed to delete employee';
        return throwError(() => Error(error));
      })
    ).subscribe(() => {
      this.loadEmployees();
    });
  }

  openAddModal(): void {
    this.date = '';
    this.time = '';
    const modal = new (window as any).bootstrap.Modal(document.getElementById('addEmployeeModal'));
    modal.show();
  }

  openUpdateModal(employee: any): void {
    this.selectedEmployee = { ...employee };
    this.date = this.selectedEmployee.birthDate.split('T')[0];
    this.time = this.selectedEmployee.birthDate.split('T')[1];
    const modal = new (window as any).bootstrap.Modal(document.getElementById('updateEmployeeModal'));
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
