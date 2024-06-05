package empl.monitor.EmployeeMonitoring.service;

import empl.monitor.EmployeeMonitoring.model.Leader;
import empl.monitor.EmployeeMonitoring.persistence.LeaderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LeaderService {
    private final LeaderRepository leaderRepository;

    @Autowired
    public LeaderService(LeaderRepository leaderRepository) {
        this.leaderRepository = leaderRepository;
    }

    public List<Leader> getAllLeaders() {
        return leaderRepository.findAll();
    }

    public Leader saveLeader(Leader leader) {
        return leaderRepository.save(leader);
    }

    public void deleteLeader(Long leaderId) {
        leaderRepository.deleteById(leaderId);
    }
}
