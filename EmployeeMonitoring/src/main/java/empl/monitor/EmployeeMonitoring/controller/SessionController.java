package empl.monitor.EmployeeMonitoring.controller;

import empl.monitor.EmployeeMonitoring.model.Session;
import empl.monitor.EmployeeMonitoring.service.SessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/employee-monitoring/sessions")
@CrossOrigin(origins = "http://localhost:4200")
public class SessionController {
    private final SessionService sessionService;
    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    public SessionController(SessionService sessionService, SimpMessagingTemplate messagingTemplate) {
        this.sessionService = sessionService;
        this.messagingTemplate = messagingTemplate;
    }

    @GetMapping("/logged-in")
    public ResponseEntity<List<Session>> getLoggedInEmployees() {
        return ResponseEntity.ok(sessionService.getLoggedInEmployees());
    }

    @PostMapping("/clock-up")
    public ResponseEntity<?> clockUp(@RequestParam Long employeeId, @RequestParam String arrivalTime) {
        try {
            LocalTime time = LocalTime.parse(arrivalTime);
            if (time.isBefore(LocalTime.of(6, 0)) || time.isAfter(LocalTime.of(18, 0))) {
                return new ResponseEntity<>("Time must be within working hours and before current time.", HttpStatus.BAD_REQUEST);
            }
            Session session = sessionService.clockUp(employeeId, time);
            messagingTemplate.convertAndSend("/topic/loggedInEmployees", session);
            messagingTemplate.convertAndSend("/topic/notifications", "Employee " + session.getLoggedInEmployee().getName() + " clocked up at " + time);
            return new ResponseEntity<>(session, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("Invalid time format", HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/logout/{employeeId}")
    public ResponseEntity<?> logout(@PathVariable Long employeeId) {
        sessionService.deleteSessionByEmployeeId(employeeId);
        messagingTemplate.convertAndSend("/topic/logouts", employeeId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
