package empl.monitor.EmployeeMonitoring.persistence;

import empl.monitor.EmployeeMonitoring.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsernameAndPassword(String username, String password);
}
