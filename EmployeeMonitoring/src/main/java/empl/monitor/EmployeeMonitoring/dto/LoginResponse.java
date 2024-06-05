package empl.monitor.EmployeeMonitoring.dto;

import empl.monitor.EmployeeMonitoring.model.User;
import lombok.Data;

@Data
public class LoginResponse {
    private String token;
    private User user;
}
