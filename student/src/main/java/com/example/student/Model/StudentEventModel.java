package com.example.student.Model;

import java.time.LocalDate;

import lombok.Data;

@Data
public class StudentEventModel {

    private String id;
    private String studentName;
    private String studentRollNumber;
    private String eventName;
    private String eventLocation;
    private LocalDate eventDate;
    private String eventDescription;
    private String facultyId;
}
