package com.demo.profinder.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Data
@NoArgsConstructor
@Table(name="jobs")
public class Job {
    @Id
    private String id;
    private String companyCode;
    private String company;
    private String position;
    private String location;
    private int minExperience;
    private int maxExperience;
    private String description;
    @ElementCollection
    @CollectionTable(name = "job_skills", joinColumns = @JoinColumn(name = "job_id"))
    @Column(name = "skill")

    private List<String> skills;


    public Job(String id, String companyCode, String company, String position, String location,
               int minExperience, int maxExperience, String description, List<String> skills) {
        this.id = id;
        this.companyCode = companyCode;
        this.company = company;
        this.position = position;
        this.location = location;
        this.minExperience = minExperience;
        this.maxExperience = maxExperience;
        this.description = description;
        this.skills = skills;
    }


    @JsonProperty("id")
    public String getId() {
        return id;
    }

}


