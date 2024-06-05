package empl.monitor.EmployeeMonitoring.controller;

import empl.monitor.EmployeeMonitoring.dto.LoginRequest;
import empl.monitor.EmployeeMonitoring.dto.LoginResponse;
import empl.monitor.EmployeeMonitoring.service.UserService;
import empl.monitor.EmployeeMonitoring.util.JwtUtil;
import io.jsonwebtoken.Jwt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin
@RestController
@RequestMapping("/employee-monitoring/users")
public class UserController {
    private final UserService userService;
    private final JwtUtil jwtUtil;

    @Autowired
    public UserController(UserService userService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest) {
        LoginResponse loginResponse = userService.login(loginRequest);
        if (loginResponse.getUser() == null) {
            loginResponse.setToken("Wrong credentials");
            return ResponseEntity.status(401).body(loginResponse);
        }

        String token = jwtUtil.generateToken(loginResponse.getUser().getUsername());
        loginResponse.setToken(token);

        return ResponseEntity.ok(loginResponse);
    }
}
