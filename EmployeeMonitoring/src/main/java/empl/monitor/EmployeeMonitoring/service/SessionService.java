package empl.monitor.EmployeeMonitoring.service;

import empl.monitor.EmployeeMonitoring.model.Employee;
import empl.monitor.EmployeeMonitoring.model.Session;
import empl.monitor.EmployeeMonitoring.persistence.EmployeeRepository;
import empl.monitor.EmployeeMonitoring.persistence.SessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;
import java.util.List;

@Service
public class SessionService {
    private final SessionRepository sessionRepository;
    private final EmployeeRepository employeeRepository;

    @Autowired
    public SessionService(SessionRepository sessionRepository, EmployeeRepository employeeRepository) {
        this.sessionRepository = sessionRepository;
        this.employeeRepository = employeeRepository;
    }

    public List<Session> getLoggedInEmployees() {
        return sessionRepository.findByLoggedInEmployeeIsNotNull();
    }

    public Session clockUp(Long employeeId, LocalTime arrivalTime) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        Session session = new Session();
        session.setArrivalTime(arrivalTime);
        session.setLoggedInEmployee(employee);

        return sessionRepository.save(session);
    }

    @Transactional
    public void deleteSessionByEmployeeId(Long employeeId) {
        sessionRepository.deleteByLoggedInEmployeeId(employeeId);
    }
}
