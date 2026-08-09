package com.demo.profinder.model;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "job_applications")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class JobApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String qualification;
    private String resumeLink;
    private String status;

    @ElementCollection
    @CollectionTable(name = "job_application_skills", joinColumns = @JoinColumn(name = "job_application_id"))
    @Column(name = "skill")
    private List<String> skills;

    @ManyToOne
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;




    @JsonProperty("id")
    public Long getIdJson() {
        return id;
    }

    @JsonProperty("jobId")
    public String getJobIdJson() {
        return job != null ? job.getId() : null;
    }
}
