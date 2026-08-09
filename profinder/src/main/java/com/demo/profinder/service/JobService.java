//package com.demo.profinder.service;
//
//import com.demo.profinder.model.Job;
//import com.demo.profinder.model.Recruiter;
//import com.demo.profinder.repository.JobRepository;
//import com.demo.profinder.repository.RecruiterRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//import java.util.List;
//import java.util.Optional;

//@Service
//public class JobService {
//
//    @Autowired
//    private JobRepository jobRepository;
//
//    @Autowired
//    private RecruiterRepository recruiterRepository;
//
//    // Get all jobs
//    public List<Job> allJobs() {
//        return jobRepository.findAll();
//    }
//
//    // Get single job by ID
//    public Optional<Job> singleJob(String id) {
//        return jobRepository.findById(id);
//    }
//
//    // Create or update a job
//    public Job createJob(Job job) {
//        String companyCode = job.getCompanyCode();
//        long count = jobRepository.countByCompanyCode(companyCode);
//        String jobId = companyCode + String.format("%02d", count + 1);
//        job.setId(jobId);
//        return jobRepository.save(job);
//    }
//
//    // Delete job by ID
//    public void deleteJob(String id) {
//        Job job = jobRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("Job not found"));
//        jobRepository.delete(job);
//    }
//
//    // ✅ New method: Create job and map to recruiter automatically
//    public Job createJobForRecruiter(Job job, String recruiterEmail) {
//        // Generate job ID like your original createJob
//        String companyCode = job.getCompanyCode();
//        long count = jobRepository.countByCompanyCode(companyCode);
//        String jobId = companyCode + String.format("%02d", count + 1);
//        job.setId(jobId);
//
//        // Save the job
//        Job savedJob = jobRepository.save(job);
//
//        // Find recruiter by email
//        Recruiter recruiter = recruiterRepository.findByEmail(recruiterEmail)
//                .orElseThrow(() -> new RuntimeException("Recruiter not found"));
//
//        // Automatically add the job ID to recruiter
//        recruiter.addJobId(savedJob.getId());
//        recruiterRepository.save(recruiter);
//
//        return savedJob;
//    }
//}

package com.demo.profinder.service;

import com.demo.profinder.model.Job;
import com.demo.profinder.model.Recruiter;
import com.demo.profinder.repository.JobRepository;
import com.demo.profinder.repository.RecruiterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JobService {

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private RecruiterRepository recruiterRepository;

    // Get all jobs
    public List<Job> allJobs() {
        return jobRepository.findAll();
    }

    // Get single job by ID
    public Job singleJob(String id) {
        return jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found"));
    }

    // Create or update a job with proper ID and experience logic
    public Job createJob(Job job) {
        String companyCode = job.getCompanyCode();

        // Option 2: generate new job ID based on last created job
        Job lastJob = jobRepository.findTopByCompanyCodeOrderByIdDesc(companyCode);
        int newNumber = 1;
        if (lastJob != null) {
            String lastId = lastJob.getId();
            String numberPart = lastId.substring(companyCode.length());
            newNumber = Integer.parseInt(numberPart) + 1;
        }
        String jobId = companyCode + String.format("%02d", newNumber);
        job.setId(jobId);

        // Limit maxExperience to 25 if necessary
        if (job.getMaxExperience() > 25) {
            job.setMaxExperience(25);
        }

        return jobRepository.save(job);
    }

    // Delete job by ID
    public void deleteJob(String id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found"));
        jobRepository.delete(job);
    }

    // Create job and assign it to a recruiter
    public Job createJobForRecruiter(Job job, String recruiterEmail) {
        String companyCode = job.getCompanyCode();

        // Generate job ID like Option 2
        Job lastJob = jobRepository.findTopByCompanyCodeOrderByIdDesc(companyCode);
        int newNumber = 1;
        if (lastJob != null) {
            String lastId = lastJob.getId();
            String numberPart = lastId.substring(companyCode.length());
            newNumber = Integer.parseInt(numberPart) + 1;
        }
        String jobId = companyCode + String.format("%02d", newNumber);
        job.setId(jobId);

        // Limit maxExperience to 25
        if (job.getMaxExperience() > 25) {
            job.setMaxExperience(25);
        }

        // Save job
        Job savedJob = jobRepository.save(job);

        // Assign job to recruiter
        Recruiter recruiter = recruiterRepository.findByEmail(recruiterEmail)
                .orElseThrow(() -> new RuntimeException("Recruiter not found"));
        recruiter.addJobId(savedJob.getId());
        recruiterRepository.save(recruiter);

        return savedJob;
    }


    // Update job for recruiter
    public Job updateJobForRecruiter(String id, Job jobUpdates, String recruiterEmail) {
        // Fetch the existing job
        Job existingJob = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        // Verify the recruiter owns this job
        Recruiter recruiter = recruiterRepository.findByEmail(recruiterEmail)
                .orElseThrow(() -> new RuntimeException("Recruiter not found"));

        if (!recruiter.getJobIds().contains(existingJob.getId())) {
            throw new RuntimeException("Recruiter does not have permission to edit this job");
        }

        // Apply updates
        existingJob.setCompanyCode(jobUpdates.getCompanyCode());
        existingJob.setCompany(jobUpdates.getCompany());
        existingJob.setPosition(jobUpdates.getPosition());
        existingJob.setLocation(jobUpdates.getLocation());
        existingJob.setMinExperience(jobUpdates.getMinExperience());
        existingJob.setMaxExperience(Math.min(jobUpdates.getMaxExperience(), 25)); // enforce max 25
        existingJob.setDescription(jobUpdates.getDescription());
        existingJob.setSkills(jobUpdates.getSkills());

        // Save and return updated job
        return jobRepository.save(existingJob);
    }

}
