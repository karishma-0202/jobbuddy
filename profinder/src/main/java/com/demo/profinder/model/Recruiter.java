package com.demo.profinder.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "recruiters")
public class Recruiter {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private String password;
    private String company;
    private String location;


    // Change from Long -> String to match Job.id
    @ElementCollection
    private List<String> jobIds = new ArrayList<>();

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    // Optional: returns jobIds as list of strings (already Strings now)
    @JsonProperty("jobIds")
    public List<String> getJobIdsString() {
        return jobIds != null ? new ArrayList<>(jobIds) : null;
    }

    // Add job ID
    public void addJobId(String jobId) {
        if (this.jobIds == null) {
            this.jobIds = new ArrayList<>();
        }
        this.jobIds.add(jobId);
    }

    // Remove job ID
    public void removeJobId(String jobId) {
        if (this.jobIds != null) {
            this.jobIds.remove(jobId);
        }
    }
}
