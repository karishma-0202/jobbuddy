package com.demo.profinder.config;

import com.demo.profinder.service.CandidateDetailService;
import com.demo.profinder.service.RecruiterDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
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

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            CandidateDetailService candidateDetailService,
            RecruiterDetailService recruiterDetailService) {

        DaoAuthenticationProvider candidateAuthProvider =
                new DaoAuthenticationProvider();
        candidateAuthProvider.setUserDetailsService(candidateDetailService);
        candidateAuthProvider.setPasswordEncoder(passwordEncoder());

        DaoAuthenticationProvider recruiterAuthProvider =
                new DaoAuthenticationProvider();
        recruiterAuthProvider.setUserDetailsService(recruiterDetailService);
        recruiterAuthProvider.setPasswordEncoder(passwordEncoder());

        return new org.springframework.security.authentication.ProviderManager(
                candidateAuthProvider,
                recruiterAuthProvider
        );
    }

    @Autowired
    private JwtAuthFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())

                .cors(cors -> {})

                .authorizeHttpRequests(auth -> auth

                        // CORS preflight
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // PUBLIC AUTHENTICATION ENDPOINTS
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/candidates/login",
                                "/api/candidates/signup",
                                "/api/recruiters/login",
                                "/api/recruiters/signup"
                        ).permitAll()

                        // PUBLIC JOB ENDPOINTS
                        .requestMatchers("/api/v1/jobs/**").permitAll()
                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/v1/jobs/**"
                        ).permitAll()

                        // CANDIDATE
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/v1/recommendations/**"
                        ).hasRole("USER")

                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/v1/applications/**"
                        ).hasRole("USER")

                        .requestMatchers("/api/candidates/**")
                        .hasRole("USER")

                        // RECRUITER
                        .requestMatchers("/api/recruiters/**")
                        .hasRole("RECRUITER")

                        .requestMatchers(
                                HttpMethod.PATCH,
                                "/api/v1/applications/**"
                        ).hasRole("RECRUITER")

                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/v1/jobs/create-with-recruiter"
                        ).hasRole("RECRUITER")

                        .anyRequest().authenticated()
                )

                .addFilterBefore(
                        jwtAuthFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }
}