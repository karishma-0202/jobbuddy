package com.demo.profinder.controller;
import com.demo.profinder.model.Job;
import com.demo.profinder.model.JobApplication;
import com.demo.profinder.repository.JobRepository;
import com.demo.profinder.service.JobApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/applications")
//@CrossOrigin(origins = "http://localhost:5173")
public class JobApplicationController {

    private static final List<String> VALID_STATUS_OPTIONS = Arrays.asList("Pending", "Accepted", "Rejected");

    @Autowired
    private JobApplicationService jobApplicationService;
    @Autowired
    private JobRepository jobRepository;

    @GetMapping
    public ResponseEntity<List<JobApplication>> getAllJobApplications() {
        return new ResponseEntity<>(jobApplicationService.allJobApplications(), HttpStatus.OK);
    }

    @GetMapping("/{applicationId}")
    public ResponseEntity<Optional<JobApplication>> getSingleJobApplication(@PathVariable Long applicationId) {
        return new ResponseEntity<>(jobApplicationService.singleJobApplication(applicationId), HttpStatus.OK);
    }

    @PostMapping("/job/{jobId}")
    public ResponseEntity<JobApplication> createApplication(
            @PathVariable String jobId,
            @RequestBody JobApplication application) {

        // Find the job first
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found with id: " + jobId));

        application.setJob(job);

        return new ResponseEntity<>(jobApplicationService.createJobApplication(application), HttpStatus.CREATED);
    }
    @PatchMapping("/{applicationId}/status")
    public ResponseEntity<JobApplication> updateStatus(
            @PathVariable Long applicationId,
            @RequestParam String status,
            Authentication auth) {
        if (auth != null) {
            System.out.println("Authenticated user: " + auth.getName());
            System.out.println("Authorities: " + auth.getAuthorities());
        }else{
            System.out.println("ERROR: Authentication object is null for a secured endpoint.");

        }

        return new ResponseEntity<>(jobApplicationService.updateStatus(applicationId, status), HttpStatus.OK);
    }

}
