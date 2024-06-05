package empl.monitor.EmployeeMonitoring.persistence;

import empl.monitor.EmployeeMonitoring.model.Leader;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LeaderRepository extends JpaRepository<Leader, Long> {
}
