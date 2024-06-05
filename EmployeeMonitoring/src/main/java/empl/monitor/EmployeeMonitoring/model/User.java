package empl.monitor.EmployeeMonitoring.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "myuser")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String username;
    private String password;
}
