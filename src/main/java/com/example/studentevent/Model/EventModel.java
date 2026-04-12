package com.example.studentevent.Model;

import java.time.LocalDate;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Data
@Document("events")
public class EventModel {

    @Id
    private String id;
    private String studentName;
    private String studentRollNumber;
    private String eventName;
    private String eventLocation;
    private LocalDate eventDate;
    private String eventDescription;
    private String facultyId;
}
