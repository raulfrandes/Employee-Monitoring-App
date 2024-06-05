import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LeaderDashboardComponent } from './leader-dashboard/leader-dashboard.component';
import { EmployeeDashboardComponent } from './employee-dashboard/employee-dashboard.component';
import { EmployeeMonitoringComponent } from './employee-monitoring/employee-monitoring.component';
import { TasksComponent } from './tasks/tasks.component';
import { authGuard } from './login/auth.guard';
import { EmployeeTasksComponent } from './employee-tasks/employee-tasks.component';
import { ClockUpComponent } from './clock-up/clock-up.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { ManageEmployeesComponent } from './manage-employees/manage-employees.component';
import { ManageLeadersComponent } from './manage-leaders/manage-leaders.component';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'leader-dashboard', component: LeaderDashboardComponent, canActivate: [authGuard] },
    { path: 'employee-dashboard', component: EmployeeDashboardComponent, canActivate: [authGuard] },
    { path: 'employee-monitoring', component: EmployeeMonitoringComponent, canActivate: [authGuard] },
    { path: 'tasks', component: TasksComponent, canActivate: [authGuard] },
    { path: 'employee-tasks', component: EmployeeTasksComponent, canActivate: [authGuard] },
    { path: 'clock-up', component: ClockUpComponent },
    { path: 'admin-dashboard', component: AdminDashboardComponent, canActivate: [authGuard] },
    { path: 'manage-employees', component: ManageEmployeesComponent, canActivate: [authGuard] },
    { path: 'manage-leaders', component: ManageLeadersComponent, canActivate: [authGuard] }
];
