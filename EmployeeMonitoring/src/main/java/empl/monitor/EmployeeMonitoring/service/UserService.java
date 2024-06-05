package empl.monitor.EmployeeMonitoring.service;

import empl.monitor.EmployeeMonitoring.dto.LoginRequest;
import empl.monitor.EmployeeMonitoring.dto.LoginResponse;
import empl.monitor.EmployeeMonitoring.model.User;
import empl.monitor.EmployeeMonitoring.persistence.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {
    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public LoginResponse login(LoginRequest loginRequest) {
        Optional<User> userOptional = userRepository.findByUsernameAndPassword(
                loginRequest.getUsername(), loginRequest.getPassword());

        LoginResponse loginResponse = new LoginResponse();

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            loginResponse.setUser(user);
        } else {
            loginResponse.setUser(null);
        }

        return loginResponse;
    }
}
