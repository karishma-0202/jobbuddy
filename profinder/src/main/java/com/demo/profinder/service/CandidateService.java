package com.demo.profinder.service;

import com.demo.profinder.model.Candidate;
import com.demo.profinder.repository.CandidateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CandidateService {
    @Autowired
    CandidateRepository candidateRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    public List<Candidate> allCandidates() {
        return candidateRepository.findAll();
    }

    public Optional<Candidate> singleCandidate(String email) {
        return candidateRepository.findByEmail(email);
    }
    public Candidate createCandidate(Candidate candidate) {
        String hashedPassword = passwordEncoder.encode(candidate.getPassword());
        candidate.setPassword(hashedPassword);
        return candidateRepository.save(candidate);
    }

}
