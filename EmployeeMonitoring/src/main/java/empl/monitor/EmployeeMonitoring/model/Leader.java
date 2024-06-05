package empl.monitor.EmployeeMonitoring.model;

import jakarta.persistence.Entity;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Data
@EqualsAndHashCode(callSuper = true)
public class Leader extends Employee{
    private String leadershipRole;
}
