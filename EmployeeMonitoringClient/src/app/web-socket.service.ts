import { Injectable } from '@angular/core';
import { Client } from '@stomp/stompjs';
import { Observable, Subject } from 'rxjs';
import { Task } from './model/task';
import SockJS from 'sockjs-client';
import { Session } from './model/session';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private client: Client;
  private taskSubject: Subject<Task> = new Subject<Task>();
  private deleteTaskSubject: Subject<number> = new Subject<number>();
  private clockUpSubject: Subject<Session> = new Subject<Session>();
  private notificationSubject: Subject<string> = new Subject<string>();
  private localUpdate: boolean = false;
  private logoutSubject: Subject<number> = new Subject<number>();
  private assignmentSubject: Subject<Task> = new Subject<Task>();

  constructor() { 
    this.client = new Client({
      brokerURL: 'ws://localhost:8080/ws',
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      webSocketFactory: () => {
        return new SockJS('http://localhost:8080/ws');
      },
      debug: (str) => {
        console.log(new Date(), str);
      }
    });

    this.client.onConnect = () => {
      this.client.subscribe('/topic/tasks', (message) => {
        if (message.body) {
          const task: Task = JSON.parse(message.body);
          if (!this.localUpdate) {
            this.taskSubject.next(task);
          }
          this.localUpdate = false;
        }
      });

      this.client.subscribe('/topic/tasks/delete', (message) => {
        if (message.body) {
          this.deleteTaskSubject.next(JSON.parse(message.body));
        }
      });

      this.client.subscribe('/topic/loggedInEmployees', (message) =>{
        if (message.body) {
          const session: Session = JSON.parse(message.body);
          this.clockUpSubject.next(session);
        }
      });

      this.client.subscribe('/topic/notifications', (message) => {
        if (message.body) {
          this.notificationSubject.next(message.body);
        }
      });

      this.client.subscribe('/topic/logouts', (message) => {
        if (message.body) {
          const employeeId: number = JSON.parse(message.body);
          this.logoutSubject.next(employeeId);
        }
      });

      this.client.subscribe('/topic/assignment', (message) => {
        if (message.body) {
          const task: Task = JSON.parse(message.body);
          this.assignmentSubject.next(task);
        }
      });
    };

    this.client.onStompError = (frame) => {
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);
    };

    this.client.activate();
  }

  getTaskUpdates(): Observable<Task> {
    return this.taskSubject.asObservable();
  }

  getDeleteTaskUpdates(): Observable<number> {
    return this.deleteTaskSubject.asObservable();
  }

  getClockUpUpdates(): Observable<Session> {
    return this.clockUpSubject.asObservable();
  }

  getNotifications(): Observable<string> {
    return this.notificationSubject.asObservable();
  }

  getLogoutUpdates(): Observable<number> {
    return this.logoutSubject.asObservable();
  }

  setLocalUpdate(value: boolean): void {
    this.localUpdate = value;
  }

  getAssignmentUpdates(): Observable<Task> {
    return this.assignmentSubject.asObservable();
  }
}
