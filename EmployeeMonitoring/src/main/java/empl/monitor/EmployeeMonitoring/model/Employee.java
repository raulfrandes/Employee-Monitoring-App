package empl.monitor.EmployeeMonitoring.model;

import jakarta.persistence.Entity;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

@Entity
@Data
@EqualsAndHashCode(callSuper = true)
public class Employee extends User {
    private String name;
    private String telephone;
    private String email;
    private String jobTitle;
    private String department;
    private LocalDateTime birthDate;
}
