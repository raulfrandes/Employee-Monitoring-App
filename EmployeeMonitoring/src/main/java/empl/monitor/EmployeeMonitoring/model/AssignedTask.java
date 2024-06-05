package empl.monitor.EmployeeMonitoring.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
@IdClass(AssignedTaskId.class)
public class AssignedTask {
    @Id
    @ManyToOne
    @JoinColumn(name = "employee_id")
    private Employee employee;

    @Id
    @ManyToOne
    @JoinColumn(name = "task_id")
    private Task task;

    private LocalDateTime startDate;
}
