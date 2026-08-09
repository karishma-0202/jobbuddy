//package com.demo.profinder.config;
//
//import com.demo.profinder.service.CandidateDetailService;
//import com.demo.profinder.service.RecruiterDetailService;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.security.authentication.AuthenticationManager;
//import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.security.web.SecurityFilterChain;
//
//@Configuration
//public class SecurityConfig {
//
//    private final CandidateDetailService candidateDetailService;
//    private final RecruiterDetailService recruiterDetailService;
//
//    public SecurityConfig(CandidateDetailService candidateDetailService,
//                          RecruiterDetailService recruiterDetailService) {
//        this.candidateDetailService = candidateDetailService;
//        this.recruiterDetailService = recruiterDetailService;
//    }
//
//    // Password encoder bean
//    @Bean
//    public PasswordEncoder passwordEncoder() {
//        return new BCryptPasswordEncoder();
//    }
//
//    // AuthenticationManager with two separate providers
//    @Bean
//    public AuthenticationManager authenticationManager() {
//        DaoAuthenticationProvider candidateAuthProvider = new DaoAuthenticationProvider();
//        candidateAuthProvider.setUserDetailsService(candidateDetailService);
//        candidateAuthProvider.setPasswordEncoder(passwordEncoder());
//
//        DaoAuthenticationProvider recruiterAuthProvider = new DaoAuthenticationProvider();
//        recruiterAuthProvider.setUserDetailsService(recruiterDetailService);
//        recruiterAuthProvider.setPasswordEncoder(passwordEncoder());
//
//        return new org.springframework.security.authentication.ProviderManager(
//                candidateAuthProvider, recruiterAuthProvider);
//    }
//
//    // Security filter chain with role-based access
//    @Bean
//    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
//        http
//                .csrf(csrf -> csrf.disable())
//                .authorizeHttpRequests(auth -> auth
//                        // Candidate-specific endpoints
//                        .requestMatchers("/candidate/**").hasRole("USER")
//                        // Recruiter-specific endpoints
//                        .requestMatchers("/recruiter/**").hasRole("RECRUITER")
//                        // All other requests allowed
//                        .anyRequest().permitAll()
//                )
//                .cors();
//
//        return http.build();
//    }
//}
package com.demo.profinder.config;

import com.demo.profinder.service.CandidateDetailService;
import com.demo.profinder.service.RecruiterDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod; // 👈 NEW IMPORT REQUIRED
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final CandidateDetailService candidateDetailService;
    private final RecruiterDetailService recruiterDetailService;

    public SecurityConfig(CandidateDetailService candidateDetailService,
                          RecruiterDetailService recruiterDetailService) {
        this.candidateDetailService = candidateDetailService;
        this.recruiterDetailService = recruiterDetailService;
    }

    // Password encoder bean
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // AuthenticationManager with two separate providers
    @Bean
    public AuthenticationManager authenticationManager(CandidateDetailService candidateDetailService, RecruiterDetailService recruiterDetailService) {
        DaoAuthenticationProvider candidateAuthProvider = new DaoAuthenticationProvider();
        candidateAuthProvider.setUserDetailsService(candidateDetailService);
        candidateAuthProvider.setPasswordEncoder(passwordEncoder());

        DaoAuthenticationProvider recruiterAuthProvider = new DaoAuthenticationProvider();
        recruiterAuthProvider.setUserDetailsService(recruiterDetailService);
        recruiterAuthProvider.setPasswordEncoder(passwordEncoder());

        return new org.springframework.security.authentication.ProviderManager(
                candidateAuthProvider, recruiterAuthProvider);
    }
    @Autowired
    private JwtAuthFilter jwtAuthFilter;
    // Security filter chain with role-based access
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth



                                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()


                                .requestMatchers("/api/candidates/signup", "/api/candidates/login").permitAll()
                                .requestMatchers("/api/recruiters/login", "/api/recruiters/signup").permitAll()
                                .requestMatchers("/api/v1/jobs/**").permitAll()
                                .requestMatchers(HttpMethod.DELETE, "/api/v1/jobs/**").permitAll()// Jobs can be viewed by anyone
                                .requestMatchers(HttpMethod.POST, "/api/v1/recommendations/**").hasRole("USER")

// Restricted endpoints
                                .requestMatchers(HttpMethod.POST, "/api/v1/applications/**").hasRole("USER") // Candidate applies
                                .requestMatchers("/api/candidates/**").hasRole("USER")  // Candidate-specific routes
                                .requestMatchers("/api/recruiters/**").hasRole("RECRUITER") // Recruiter-specific routes
                                .requestMatchers(HttpMethod.PATCH, "/api/v1/applications/**").hasRole("RECRUITER") // Recruiter edits status
                                .requestMatchers(HttpMethod.POST, "/api/v1/jobs/create-with-recruiter").hasRole("RECRUITER")


                                .anyRequest().authenticated()



                )
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                .cors();

        return http.build();
    }
}