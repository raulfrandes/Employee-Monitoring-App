package empl.monitor.EmployeeMonitoring.controller;

import empl.monitor.EmployeeMonitoring.model.Employee;
import empl.monitor.EmployeeMonitoring.model.Leader;
import empl.monitor.EmployeeMonitoring.service.LeaderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/employee-monitoring/leaders")
@CrossOrigin(origins = "http://localhost:4200")
public class LeaderController {
    private final LeaderService leaderService;

    @Autowired
    public LeaderController(LeaderService leaderService) {
        this.leaderService = leaderService;
    }

    @GetMapping
    public ResponseEntity<Iterable<Leader>> getAllLeaders() {
        return new ResponseEntity<>(leaderService.getAllLeaders(), HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<?> saveLeader(@RequestBody Leader leader) {
        if (leader.getUsername() == null || leader.getPassword() == null || leader.getName() == null ||
                leader.getEmail() == null || leader.getTelephone() == null || leader.getJobTitle() == null ||
                leader.getDepartment() == null || leader.getBirthDate() == null) {
            return new ResponseEntity<>("Invalid leader details", HttpStatus.BAD_REQUEST);
        }

        return new ResponseEntity<>(leaderService.saveLeader(leader), HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteLeader(@PathVariable Long id) {
        leaderService.deleteLeader(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
