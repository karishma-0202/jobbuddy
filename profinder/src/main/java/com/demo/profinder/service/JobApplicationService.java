package com.demo.profinder.service;
import com.demo.profinder.model.JobApplication;
import com.demo.profinder.repository.JobApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class JobApplicationService {

    @Autowired
    private JobApplicationRepository jobApplicationRepository;

    public List<JobApplication> allJobApplications() {
        return jobApplicationRepository.findAll();
    }

    public Optional<JobApplication> singleJobApplication(Long applicationId) {
        return jobApplicationRepository.findById(applicationId);
    }
//    public List<JobApplication> applicationsForJob(String jobId) {
//        return jobApplicationRepository.findByJob_Id(jobId);
//    }

    public JobApplication createJobApplication(JobApplication jobApplication) {
        return jobApplicationRepository.save(jobApplication);
    }

    public JobApplication updateStatus(Long applicationId, String newStatus) {
        JobApplication application = jobApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Job application not found"));

        application.setStatus(newStatus);
        return jobApplicationRepository.save(application);
    }
}
