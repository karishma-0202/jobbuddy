package com.demo.profinder.service;

import com.demo.profinder.model.Recruiter;
import com.demo.profinder.repository.JobRepository;
import com.demo.profinder.repository.RecruiterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class RecruiterService {

    @Autowired
    private RecruiterRepository recruiterRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JobRepository jobRepository;

    // ------------------- Recruiter CRUD -------------------
    public List<Recruiter> findAllRecruiters() {
        return recruiterRepository.findAll();
    }

    public Optional<Recruiter> findByEmail(String email) {
        return recruiterRepository.findByEmail(email);
    }

    public boolean existsByEmail(String email) {
        return recruiterRepository.existsByEmail(email);
    }

    public Recruiter saveRecruiter(Recruiter recruiter) {
        String rawPassword = recruiter.getPassword();
        if (!rawPassword.startsWith("$2a$")) {
            recruiter.setPassword(passwordEncoder.encode(rawPassword));
        }
        return recruiterRepository.save(recruiter);
    }

    // ------------------- Job Ownership -------------------
    public boolean isJobOwnedByRecruiter(String email, String jobId) {
        Recruiter recruiter = recruiterRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Recruiter not found"));

        return recruiter.getJobIds().stream()
                .anyMatch(id -> id.equalsIgnoreCase(jobId));
    }

    public Recruiter addJobToRecruiter(String email, String jobId) {
        Recruiter recruiter = recruiterRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Recruiter not found"));

        recruiter.addJobId(jobId);
        return recruiterRepository.save(recruiter);
    }

    public Recruiter removeJobFromRecruiter(String email, String jobId) {

        Recruiter recruiter = recruiterRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Recruiter not found"));

        // ❌ BLOCK if not owner
        if (!isJobOwnedByRecruiter(email, jobId)) {
            throw new RuntimeException("Unauthorized: You cannot delete this job");
        }

        recruiter.getJobIds().removeIf(id -> id.equalsIgnoreCase(jobId));

        recruiterRepository.save(recruiter);

        jobRepository.deleteById(jobId);

        return recruiter;
    }

    // ------------------- Authentication -------------------
    public Optional<Recruiter> authenticate(String email, String rawPassword) {
        return recruiterRepository.findByEmail(email)
                .filter(r -> passwordEncoder.matches(rawPassword, r.getPassword()));
    }
}