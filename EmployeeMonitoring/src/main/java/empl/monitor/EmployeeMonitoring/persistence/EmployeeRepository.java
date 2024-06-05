package empl.monitor.EmployeeMonitoring.persistence;

import empl.monitor.EmployeeMonitoring.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {
}
