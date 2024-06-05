package empl.monitor.EmployeeMonitoring.model;

import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.util.Objects;

@Setter
@Getter
public class AssignedTaskId implements Serializable {
    private Long employee;
    private Long task;

    public AssignedTaskId() {}

    public AssignedTaskId(Long employee, Long task) {
        this.employee = employee;
        this.task = task;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        AssignedTaskId that = (AssignedTaskId) o;
        return Objects.equals(employee, that.employee) && Objects.equals(task, that.task);
    }

    @Override
    public int hashCode() {
        return Objects.hash(employee, task);
    }
}
