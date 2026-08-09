package com.demo.profinder.controller;

import com.demo.profinder.config.JwtService;
import com.demo.profinder.model.Candidate;
import com.demo.profinder.service.CandidateService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/candidates")
@CrossOrigin(origins = "http://localhost:5173")
public class CandidateController {
    @Autowired
    private CandidateService candidateService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;
    @GetMapping
    public ResponseEntity<List<Candidate>> getAllCandidates() {
        return new ResponseEntity<List<Candidate>>(candidateService.allCandidates(), HttpStatus.OK);
    }

    //    TO BE REMOVED LATER, USING JUST FOR TESTING PURPOSES
    @GetMapping("/{email}")
    public ResponseEntity<Optional<Candidate>> getSingleCandidate(@PathVariable String email) {
        return new ResponseEntity<Optional<Candidate>>(candidateService.singleCandidate(email), HttpStatus.OK);
    }

   @PostMapping("/signup")
public ResponseEntity<?> signup(@RequestBody Candidate candidate) {

    Optional<Candidate> existingCandidate = candidateService.singleCandidate(candidate.getEmail());
    if (existingCandidate.isPresent()) {
        return new ResponseEntity<>("Email already registered", HttpStatus.CONFLICT);
    }

    Candidate savedCandidate = candidateService.createCandidate(candidate);
    return new ResponseEntity<>(savedCandidate, HttpStatus.CREATED);
}



//    @PostMapping("/login")
//    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> payload, HttpServletRequest httpServletRequest) {
//        String email = payload.get("email");
//        String password = payload.get("password");
//
//        try {
//            Optional<Candidate> candidate = candidateService.singleCandidate(email);
//            if (candidate.isEmpty()) {
//                return new ResponseEntity<Map<String, Object>>(Map.of("error", "Email not found"), HttpStatus.NOT_FOUND);
//            }
//
//            String hashedPassword = candidate.get().getPassword();
//
//            if (!passwordEncoder.matches(password, hashedPassword)) {
//                return new ResponseEntity<Map<String, Object>>(Map.of("error", "Wrong password"), HttpStatus.UNAUTHORIZED);
//            }
//
//            UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(email, password);
//
//            SecurityContextHolder.getContext().setAuthentication(authToken);
//            HttpSession session = httpServletRequest.getSession(true);
//
//            Map<String, Object> responseBody = new HashMap<>();
//            responseBody.put("token", session.getId());
//            responseBody.put("candidate", candidate);
//
//            return new ResponseEntity<Map<String, Object>>(responseBody, HttpStatus.OK);
//        } catch (AuthenticationException e) {
//            return new ResponseEntity<Map<String, Object>>(Map.of("error", "Authentication error"), HttpStatus.INTERNAL_SERVER_ERROR);
//        }
//    }


    @Autowired
    private JwtService jwtService;


    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String password = payload.get("password");

        try {
            Optional<Candidate> candidateOpt = candidateService.singleCandidate(email);
            if (candidateOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Email not found"));
            }

            Candidate candidate = candidateOpt.get();
            String hashedPassword = candidate.getPassword();

            if (!passwordEncoder.matches(password, hashedPassword)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Wrong password"));
            }

            // ✅ Create UserDetails for JWT
            UserDetails userDetails = new org.springframework.security.core.userdetails.User(
                    candidate.getEmail(),
                    candidate.getPassword(),
                    List.of(new SimpleGrantedAuthority("ROLE_CANDIDATE"))
            );

            // ✅ Generate JWT token
            String jwtToken = jwtService.generateToken(userDetails);

            // ✅ Build response
            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("token", jwtToken);
            responseBody.put("candidate", candidate);

            return ResponseEntity.ok(responseBody);

        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Authentication error"));
        }
    }


    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletRequest request, HttpServletResponse response) {
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }

        SecurityContextHolder.clearContext();

        return new ResponseEntity<String>("Logged out successfully", HttpStatus.OK);
    }
}
