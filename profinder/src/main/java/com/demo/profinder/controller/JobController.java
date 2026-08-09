package com.demo.profinder.controller;

import com.demo.profinder.dto.JobRequest;
import com.demo.profinder.model.Job;
import com.demo.profinder.service.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/jobs")
//@CrossOrigin(origins = "http://localhost:5173")
public class JobController {

    @Autowired
    private JobService jobService;

    @GetMapping
    public ResponseEntity<List<Job>> getAllJobs() {
        return new ResponseEntity<>(jobService.allJobs(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Job> getSingleJob(@PathVariable String id) {
        Job job = jobService.singleJob(id); // singleJob now returns Job, not Optional<Job>
        return new ResponseEntity<>(job, HttpStatus.OK);
    }


    @PostMapping
    public ResponseEntity<Job> createJob(@RequestBody Job job) {
        Job savedJob = jobService.createJob(job);
        return new ResponseEntity<>(savedJob, HttpStatus.CREATED);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteJob(@PathVariable String id) {
        jobService.deleteJob(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PostMapping("/create-with-recruiter")
    public ResponseEntity<Job> createJobWithRecruiter(@RequestBody JobRequest jobRequest) {
        Job savedJob = jobService.createJobForRecruiter(
                new Job(
                        null,
                        jobRequest.getCompanyCode(),
                        jobRequest.getCompany(),
                        jobRequest.getPosition(),
                        jobRequest.getLocation(),
                        jobRequest.getMinExperience(),
                        jobRequest.getMaxExperience(),
                        jobRequest.getDescription(),
                        jobRequest.getSkills()
                ),
                jobRequest.getRecruiterEmail()
        );

        return new ResponseEntity<>(savedJob, HttpStatus.CREATED);
    }

    @PutMapping("/edit-with-recruiter/{id}")
    public ResponseEntity<Job> editJobWithRecruiter(
            @PathVariable String id,
            @RequestBody JobRequest jobRequest) {

        Job updatedJob = jobService.updateJobForRecruiter(
                id,
                new Job(
                        id,
                        jobRequest.getCompanyCode(),
                        jobRequest.getCompany(),
                        jobRequest.getPosition(),
                        jobRequest.getLocation(),
                        jobRequest.getMinExperience(),
                        jobRequest.getMaxExperience(),
                        jobRequest.getDescription(),
                        jobRequest.getSkills()
                ),
                jobRequest.getRecruiterEmail()
        );

        return new ResponseEntity<>(updatedJob, HttpStatus.OK);
    }



}
