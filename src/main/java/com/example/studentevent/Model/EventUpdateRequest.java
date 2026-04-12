package com.example.studentevent.Model;

import java.time.LocalDate;

import lombok.Data;

@Data
public class EventUpdateRequest {

    private String studentName;
    private String studentRollNumber;
    private String eventName;
    private String eventLocation;
    private LocalDate eventDate;
    private String eventDescription;
}
