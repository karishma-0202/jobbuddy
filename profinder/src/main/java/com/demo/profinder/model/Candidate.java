package com.demo.profinder.model;

import com.demo.profinder.convertor.SkillsJsonConverter;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Data
@NoArgsConstructor
@Table(name="candidates")
public class Candidate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String email;
    private String password;


    @Column (columnDefinition = "json")  // 👈 tells MySQL to store this as JSON
    @Convert(converter = SkillsJsonConverter.class) // 👈 use our converter
    private List<String> skills;

    public Candidate(Long id,String name, String email, String password, List<String> skills) {
       this.id=id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.skills = skills;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    @JsonProperty("Id")
    public String getIdString() {
        return id != null ? String.valueOf(id) : null;
    }



}
