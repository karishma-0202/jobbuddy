package com.demo.profinder.service;

import com.demo.profinder.model.Job;
import com.demo.profinder.repository.JobRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;


import java.util.*;

@Service
public class RecommendationService {

    @Autowired
    private JobRepository jobRepository;

    private final RestTemplate restTemplate = new RestTemplate();

    private static final String PYTHON_RESUME_API =
        System.getenv().getOrDefault("PYTHON_SERVICE_URL", "http://127.0.0.1:8000")
        + "/recommend/resume";

    private static final String PYTHON_MANUAL_API =
        System.getenv().getOrDefault("PYTHON_SERVICE_URL", "http://127.0.0.1:8000")
        + "/recommend/manual";

    private final ObjectMapper objectMapper = new ObjectMapper();

    // -------------------------
    // Resume Upload → Python API
    // -------------------------
    public List<Job> recommendFromResume(MultipartFile file, String location) {

        try {
            List<Map<String, Object>> recommended = callPythonResumeAPI(file, location);
            return mapToFullJobs(recommended);

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Python API failed: " + e.getMessage());
        }
    }

    // -------------------------
    // Manual Skill Input → Python API
    // -------------------------
    public List<Job> recommendFromSkillsAndExperience(
            List<String> skills,
            int experience,
            String location
    ) {

        try {
            List<Map<String, Object>> recommended =
                    callPythonManualAPI(skills, experience, location);

            return mapToFullJobs(recommended);

        } catch (Exception e) {
            e.printStackTrace();
            return Collections.emptyList();
        }
    }

    // -------------------------
    // CALL PYTHON (RESUME)
    // -------------------------
    private List<Map<String, Object>> callPythonResumeAPI(
            MultipartFile file,
            String location
    ) throws Exception {

        List<Map<String, Object>> jobList = buildJobList();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();

        body.add("resume", new ByteArrayResource(file.getBytes()) {
            @Override
            public String getFilename() {
                return file.getOriginalFilename();
            }
        });

        body.add("jobs", objectMapper.writeValueAsString(jobList));
        body.add("experience", 0); // ✅ FIXED
        body.add("location", location == null ? "" : location);

        HttpEntity<MultiValueMap<String, Object>> request =
                new HttpEntity<>(body, headers);

        ResponseEntity<Map> response =
                restTemplate.postForEntity(PYTHON_RESUME_API, request, Map.class);

        Map<String, Object> responseBody = response.getBody();
        System.out.println("🔥 PYTHON RESPONSE (RESUME): " + responseBody);
        if (responseBody == null) return Collections.emptyList();

        Object jobsObj = responseBody.get("recommendedJobs");
        if (jobsObj == null) return Collections.emptyList();

        return (List<Map<String, Object>>) jobsObj;
    }

    // -------------------------
    // CALL PYTHON (MANUAL)
    // -------------------------
    private List<Map<String, Object>> callPythonManualAPI(
            List<String> skills,
            int experience,
            String location
    ) {

        List<Map<String, Object>> jobList = buildJobList();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> body = new HashMap<>();
        body.put("skills", skills);
        body.put("jobs", jobList);
        body.put("experience", experience);
        body.put("location", location);

        HttpEntity<Map<String, Object>> request =
                new HttpEntity<>(body, headers);

        ResponseEntity<Map> response =
                restTemplate.postForEntity(PYTHON_MANUAL_API, request, Map.class);

        Map<String, Object> responseBody = response.getBody();
        System.out.println("🔥 PYTHON RESPONSE (manual): " + responseBody);
        if (responseBody == null) return Collections.emptyList();

        Object jobsObj = responseBody.get("recommendedJobs");
        if (jobsObj == null) return Collections.emptyList();

        return (List<Map<String, Object>>) jobsObj;
    }

    // -------------------------
    // Convert Python → DB Jobs
    // -------------------------
    private List<Job> mapToFullJobs(List<Map<String, Object>> recommended) {

        if (recommended == null || recommended.isEmpty()) {
            return Collections.emptyList();
        }

        List<Job> result = new ArrayList<>();

        for (Map<String, Object> item : recommended) {

            String jobId = (String) item.get("jobId");

            jobRepository.findById(jobId).ifPresent(job -> {
                result.add(job);
            });
        }

        System.out.println("🔥 FINAL JOBS SENT TO FRONTEND: " + result.size());

        return result;
    }

    // -------------------------
    // Convert DB → Python Format
    // -------------------------
    private List<Map<String, Object>> buildJobList() {

        List<Job> jobs = jobRepository.findAll();

        List<Map<String, Object>> jobList = new ArrayList<>();

        for (Job job : jobs) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", job.getId());
            map.put("description", job.getDescription());
            map.put("skills", job.getSkills());
            map.put("location", job.getLocation());
            map.put("minExperience", job.getMinExperience());
            map.put("maxExperience", job.getMaxExperience());

            jobList.add(map);
        }

        return jobList;
    }
}