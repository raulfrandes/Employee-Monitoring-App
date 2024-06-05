package empl.monitor.EmployeeMonitoring.controller;

import empl.monitor.EmployeeMonitoring.model.Employee;
import empl.monitor.EmployeeMonitoring.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/employee-monitoring/employees")
@CrossOrigin(origins = "http://localhost:4200")
public class EmployeeController {
    private final EmployeeService employeeService;

    @Autowired
    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @GetMapping
    public ResponseEntity<Iterable<Employee>> getAllEmployees() {
        return new ResponseEntity<>(employeeService.getAllEmployees(), HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<?> saveEmployee(@RequestBody Employee employee) {
        if (employee.getUsername() == null || employee.getPassword() == null || employee.getName() == null ||
                employee.getEmail() == null || employee.getTelephone() == null || employee.getJobTitle() == null ||
        employee.getDepartment() == null || employee.getBirthDate() == null) {
            return new ResponseEntity<>("Invalid employee details", HttpStatus.BAD_REQUEST);
        }

        return new ResponseEntity<>(employeeService.saveEmployee(employee), HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEmployee(@PathVariable Long id) {
        employeeService.deleteEmployee(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
