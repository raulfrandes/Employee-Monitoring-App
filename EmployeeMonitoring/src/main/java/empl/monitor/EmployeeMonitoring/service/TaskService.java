package empl.monitor.EmployeeMonitoring.service;

import empl.monitor.EmployeeMonitoring.model.*;
import empl.monitor.EmployeeMonitoring.persistence.AssignedTaskRepository;
import empl.monitor.EmployeeMonitoring.persistence.EmployeeRepository;
import empl.monitor.EmployeeMonitoring.persistence.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestParam;

import javax.swing.text.html.Option;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class TaskService {
    private final TaskRepository taskRepository;
    private final EmployeeRepository employeeRepository;
    private final AssignedTaskRepository assignedTaskRepository;

    @Autowired
    public TaskService(TaskRepository taskRepository, EmployeeRepository employeeRepository, AssignedTaskRepository assignedTaskRepository) {
        this.taskRepository = taskRepository;
        this.employeeRepository = employeeRepository;
        this.assignedTaskRepository = assignedTaskRepository;
    }

    public Iterable<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    public List<Task> getUnassignedTasks() {
        return taskRepository.findByStatus(TaskStatus.UNASSIGNED);
    }

    public List<Task> getAssignedTasks() {
        return assignedTaskRepository.findAssignedTasks();
    }

    public List<Task> getTasksForLeader() {
        List<Task> unassignedTasks = getUnassignedTasks();
        List<Task> assignedTasks = getAssignedTasks();
        unassignedTasks.addAll(assignedTasks);
        return unassignedTasks;
    }

    public List<Task> getTasksForEmployee(Long employeeId) {
        return assignedTaskRepository.findTasksByEmployeeId(employeeId);
    }

    public Task saveTask(Task task) {
        return taskRepository.save(task);
    }

    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }

    @Transactional
    public Task assignTaskToEmployee(Long taskId, Long employeeId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new IllegalArgumentException("Task not found"));
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new IllegalArgumentException("Employee not found"));

        AssignedTask assignedTask = new AssignedTask();
        assignedTask.setTask(task);
        assignedTask.setEmployee(employee);
        assignedTask.setStartDate(LocalDateTime.now());
        assignedTaskRepository.save(assignedTask);

        task.setStatus(TaskStatus.ASSIGNED);
        taskRepository.save(task);
        return task;
    }

    public AssignedTask finishTask(Long taskId, Long employeeId) {
        Optional<AssignedTask> optionalAssignedTask = assignedTaskRepository.findById(new AssignedTaskId(employeeId, taskId));
        if (optionalAssignedTask.isPresent()) {
            AssignedTask assignedTask = optionalAssignedTask.get();
            Task task = assignedTask.getTask();
            task.setStatus(TaskStatus.COMPLETED);
            taskRepository.save(task);
            assignedTaskRepository.delete(assignedTask);
            return assignedTask;
        } else {
            return null;
        }
    }
}
