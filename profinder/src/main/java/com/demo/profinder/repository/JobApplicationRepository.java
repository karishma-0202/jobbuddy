package com.demo.profinder.repository;
import com.demo.profinder.model.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {

    // If you want to fetch applications by Job
    Optional<JobApplication> findByJob_Id(String jobId);
}
