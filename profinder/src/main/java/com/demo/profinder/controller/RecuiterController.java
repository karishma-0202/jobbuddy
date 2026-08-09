package com.demo.profinder.controller;

import com.demo.profinder.dto.JobRemoveRequest;
import com.demo.profinder.dto.LoginRequest;
import com.demo.profinder.model.Recruiter;
import com.demo.profinder.service.RecruiterService;
import com.demo.profinder.config.JwtService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/recruiters")
public class RecuiterController {

    @Autowired
    private RecruiterService recruiterService;

    @Autowired
    private JwtService jwtService;

    @GetMapping
    public ResponseEntity<List<Recruiter>> getAllRecruiters() {
        return ResponseEntity.ok(recruiterService.findAllRecruiters());
    }

    @GetMapping("/{email}")
    public ResponseEntity<Recruiter> getRecruiterByEmail(@PathVariable String email) {
        return recruiterService.findByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{email}/append-job")
    public ResponseEntity<?> appendJob(@PathVariable String email, @RequestBody String jobId) {
        Recruiter updated = recruiterService.addJobToRecruiter(email, jobId);
        return ResponseEntity.ok(updated);
    }

    // ✅ FIXED DELETE (ownership check)
    @PostMapping("/{email}/remove-job")
    public ResponseEntity<?> removeJob(
            @PathVariable String email,
            @RequestBody JobRemoveRequest request) {

        try {
            recruiterService.removeJobFromRecruiter(email, request.getJobId());
            return ResponseEntity.ok("Job removed successfully");

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(e.getMessage());
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody Recruiter recruiter) {
        if (recruiterService.existsByEmail(recruiter.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Email already registered");
        }

        recruiter.setId(null);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(recruiterService.saveRecruiter(recruiter));
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody LoginRequest request) {

        return recruiterService.authenticate(request.getEmail(), request.getPassword())
                .map(recruiter -> {

                    UserDetails userDetails = new org.springframework.security.core.userdetails.User(
                            recruiter.getEmail(),
                            recruiter.getPassword(),
                            List.of(new SimpleGrantedAuthority("ROLE_RECRUITER"))
                    );

                    String jwtToken = jwtService.generateToken(userDetails);

                    Map<String, Object> response = new HashMap<>();
                    response.put("token", jwtToken);
                    response.put("recruiter", recruiter);

                    return ResponseEntity.ok(response);

                })
                .orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Invalid credentials")));
    }
}