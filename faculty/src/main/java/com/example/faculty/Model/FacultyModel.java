package com.example.faculty.Model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
@Document("faculty")
public class FacultyModel {

    @Id
    private String id;
    private String facultyId;
    private String facultyName;
    private String emailId;
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;
}
