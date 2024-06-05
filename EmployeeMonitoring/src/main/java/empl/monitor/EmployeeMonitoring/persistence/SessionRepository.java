package empl.monitor.EmployeeMonitoring.persistence;

import empl.monitor.EmployeeMonitoring.model.Session;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SessionRepository extends JpaRepository<Session, Long> {
    List<Session> findByLoggedInEmployeeIsNotNull();

    void deleteByLoggedInEmployeeId(Long employeeId);
}
