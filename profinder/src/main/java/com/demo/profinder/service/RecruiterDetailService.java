package com.demo.profinder.service;

import com.demo.profinder.model.Recruiter;
import com.demo.profinder.repository.RecruiterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Primary
public class RecruiterDetailService implements UserDetailsService {

    @Autowired
    private RecruiterRepository recruiterRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Recruiter recruiter = recruiterRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Recruiter not found"));
        List<GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority("ROLE_RECRUITER"));

        return new User(
                recruiter.getEmail(),
                recruiter.getPassword(),
                authorities

                );

    }
}
