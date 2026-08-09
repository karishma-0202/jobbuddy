package com.demo.profinder.dto;

import lombok.Data;
import java.util.List;

@Data
public class JobRequest {
    private String companyCode;
    private String company;
    private String position;
    private String location;
    private int minExperience;
    private int maxExperience;
    private String description;
    private List<String> skills;
    private String recruiterEmail; // for automatic mapping
}
