package empl.monitor.EmployeeMonitoring.controller;

import empl.monitor.EmployeeMonitoring.model.AssignedTask;
import empl.monitor.EmployeeMonitoring.model.Task;
import empl.monitor.EmployeeMonitoring.model.TaskStatus;
import empl.monitor.EmployeeMonitoring.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

import static empl.monitor.EmployeeMonitoring.model.TaskStatus.UNASSIGNED;

@RestController
@RequestMapping("/employee-monitoring/tasks")
@CrossOrigin(origins = "http://localhost:4200")
public class TaskController {
    private final TaskService taskService;
    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    public TaskController(TaskService taskService, SimpMessagingTemplate messagingTemplate) {
        this.taskService = taskService;
        this.messagingTemplate = messagingTemplate;
    }

    @GetMapping
    public ResponseEntity<Iterable<Task>> getAllTasks() {
        return ResponseEntity.ok(taskService.getAllTasks());
    }

    @GetMapping("/unassigned")
    public ResponseEntity<List<Task>> getUnassignedTasks() {
        return ResponseEntity.ok(taskService.getUnassignedTasks());
    }

    @GetMapping("/leader")
    public ResponseEntity<List<Task>> getTasksForLeader() {
        return ResponseEntity.ok(taskService.getTasksForLeader());
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<Task>> getTasksForEmployee(@PathVariable Long employeeId) {
        return ResponseEntity.ok(taskService.getTasksForEmployee(employeeId));
    }

    @PostMapping
    public ResponseEntity<?> createTask(@RequestBody Task task) {
        if (task.getName() == null || task.getDescription() == null || task.getDeadline() == null) {
            return new ResponseEntity<>("Invalid task details", HttpStatus.BAD_REQUEST);
        }

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime taskDeadline = task.getDeadline();
        if (taskDeadline.isBefore(now)) {
            return new ResponseEntity<>("The deadline must be in the future.", HttpStatus.BAD_REQUEST);
        }

        LocalTime taskTime = taskDeadline.toLocalTime();
        if (taskTime.isBefore(LocalTime.of(6, 0)) || taskTime.isAfter(LocalTime.of(18, 0))) {
            return new ResponseEntity<>("The deadline must be within working hours (06:00 AM to 06:00 PM).", HttpStatus.BAD_REQUEST);
        }

        task.setStatus(TaskStatus.UNASSIGNED);
        Task savedTask = taskService.saveTask(task);
        messagingTemplate.convertAndSend("/topic/tasks", savedTask);
        return new ResponseEntity<>(savedTask, HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        messagingTemplate.convertAndSend("/topic/tasks/delete", id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PostMapping("/assign")
    public ResponseEntity<?> assignTask(@RequestParam Long taskId, @RequestParam Long employeeId) {
        try {
            Task assignedTask = taskService.assignTaskToEmployee(taskId, employeeId);
            messagingTemplate.convertAndSend("/topic/assignment", assignedTask);
            return new ResponseEntity<>(assignedTask, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Task assignment failed", HttpStatus.BAD_REQUEST);
        }
    }

    @PatchMapping("/finish")
    public ResponseEntity<?> finishTask(@RequestParam Long taskId, @RequestParam Long employeeId) {
        try {
            AssignedTask assignedTask = taskService.finishTask(taskId, employeeId);
            if (assignedTask == null) {
                return new ResponseEntity<>("Task assignment not found", HttpStatus.BAD_REQUEST);
            }
            else {
                messagingTemplate.convertAndSend("/topic/notifications", "Task " + assignedTask.getTask().getName() + " completed by " + assignedTask.getEmployee().getName());
                messagingTemplate.convertAndSend("/topic/tasks", assignedTask.getTask());

                return new ResponseEntity<>(assignedTask.getTask(), HttpStatus.OK);
            }
        } catch (Exception e) {
            return new ResponseEntity<>("Task assignment not found", HttpStatus.BAD_REQUEST);
        }
    }
}
