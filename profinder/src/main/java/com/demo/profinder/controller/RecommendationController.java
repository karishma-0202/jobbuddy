package com.demo.profinder.controller;

import com.demo.profinder.model.Job;
import com.demo.profinder.service.RecommendationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/recommendations")
public class RecommendationController {

    @Autowired
    private RecommendationService recommendationService;

    // ✅ RESUME API
    @PostMapping("/resume")
    public ResponseEntity<?> recommendFromResume(
            @RequestParam("resume") MultipartFile file,
            @RequestParam(value = "location", required = false) String location
    ) {
        try {
            List<Job> jobs = recommendationService.recommendFromResume(file, location);

            System.out.println("🔥 FINAL JOBS SENT TO FRONTEND: " + jobs.size());

            return ResponseEntity.ok(jobs);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    // ✅ MANUAL API
    @PostMapping("/skills")
    public ResponseEntity<?> recommendFromSkills(@RequestBody Map<String, Object> request) {

        try {
            List<String> skills = (List<String>) request.get("skills");
            int experience = (int) request.getOrDefault("experience", 0);
            String location = (String) request.getOrDefault("location", "");

            List<Job> jobs = recommendationService
                    .recommendFromSkillsAndExperience(skills, experience, location);

            System.out.println("🔥 FINAL JOBS SENT TO FRONTEND: " + jobs.size());

            return ResponseEntity.ok(jobs);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }
}