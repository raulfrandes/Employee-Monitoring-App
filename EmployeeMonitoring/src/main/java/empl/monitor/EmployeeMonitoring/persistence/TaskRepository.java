package empl.monitor.EmployeeMonitoring.persistence;

import empl.monitor.EmployeeMonitoring.model.Task;
import empl.monitor.EmployeeMonitoring.model.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByStatus(TaskStatus status);
}
