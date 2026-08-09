package com.demo.profinder.convertor;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.io.IOException;
import java.util.List;

@Converter
public class SkillsJsonConverter implements AttributeConverter<List<String>, String> {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(List<String> skills) {
        try {
            return skills != null ? objectMapper.writeValueAsString(skills) : "[]";
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to convert skills to JSON", e);
        }
    }

    @Override
    public List<String> convertToEntityAttribute(String dbData) {
        try {
            return dbData != null ? objectMapper.readValue(dbData, List.class) : List.of();
        } catch (IOException e) {
            throw new RuntimeException("Failed to convert JSON to skills list", e);
        }
    }
}
