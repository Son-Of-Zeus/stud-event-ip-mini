package com.example.studentevent.Controller;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.studentevent.Model.EventModel;
import com.example.studentevent.Model.EventUpdateRequest;
import com.example.studentevent.Security.JwtClaimUtils;
import com.example.studentevent.Service.EventService;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/event")
public class EventController {

    private final EventService service;
    private final JwtClaimUtils jwtClaimUtils;

    public EventController(EventService service, JwtClaimUtils jwtClaimUtils) {
        this.service = service;
        this.jwtClaimUtils = jwtClaimUtils;
    }

    @PostMapping("/add")
    public EventModel addEvent(@RequestBody EventModel eventModel, Authentication authentication) {
        String facultyId = jwtClaimUtils.requireFacultyId(authentication);
        return service.addEvent(eventModel, facultyId);
    }

    @GetMapping("/month/{year}/{month}")
    public List<EventModel> getEventsByMonth(
            @PathVariable int year,
            @PathVariable int month,
            Authentication authentication) {
        String facultyId = jwtClaimUtils.requireFacultyId(authentication);
        return service.getEventsByMonth(year, month, facultyId);
    }

    @GetMapping("/student/{rollNumber}")
    public List<EventModel> getEventsByStudentRollNumber(@PathVariable String rollNumber, Authentication authentication) {
        return service.getEventsByStudentRollNumber(
                rollNumber,
                jwtClaimUtils.getRole(authentication),
                jwtClaimUtils.getRollNumber(authentication));
    }

    @GetMapping("/faculty")
    public List<EventModel> getEventsByFaculty(Authentication authentication) {
        String facultyId = jwtClaimUtils.requireFacultyId(authentication);
        return service.getEventsByFaculty(facultyId);
    }

    @GetMapping("/{eventId}")
    public EventModel getEventById(@PathVariable String eventId, Authentication authentication) {
        String facultyId = jwtClaimUtils.requireFacultyId(authentication);
        return service.getEventById(eventId, facultyId);
    }

    @PutMapping("/update/{eventId}")
    public EventModel updateEvent(
            @PathVariable String eventId,
            @RequestBody EventUpdateRequest updateRequest,
            Authentication authentication) {
        String facultyId = jwtClaimUtils.requireFacultyId(authentication);
        return service.updateEvent(eventId, facultyId, updateRequest);
    }

    @DeleteMapping("/delete/{eventId}")
    public boolean deleteEvent(@PathVariable String eventId, Authentication authentication) {
        String facultyId = jwtClaimUtils.requireFacultyId(authentication);
        return service.deleteEvent(eventId, facultyId);
    }
}
