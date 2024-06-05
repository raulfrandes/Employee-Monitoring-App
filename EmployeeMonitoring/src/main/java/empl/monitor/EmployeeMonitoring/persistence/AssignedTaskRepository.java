package empl.monitor.EmployeeMonitoring.persistence;

import empl.monitor.EmployeeMonitoring.model.AssignedTask;
import empl.monitor.EmployeeMonitoring.model.AssignedTaskId;
import empl.monitor.EmployeeMonitoring.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface AssignedTaskRepository extends JpaRepository<AssignedTask, AssignedTaskId> {
    @Query("SELECT at.task FROM AssignedTask at WHERE at.employee.id = :employeeId")
    List<Task> findTasksByEmployeeId(Long employeeId);

    @Query("SELECT at.task FROM AssignedTask at")
    List<Task> findAssignedTasks();
}
