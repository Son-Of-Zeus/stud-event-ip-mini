package com.example.studentevent.Service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.studentevent.Model.EventModel;
import com.example.studentevent.Model.EventUpdateRequest;
import com.example.studentevent.Repository.EventRepository;

@Service
public class EventService {

    private final EventRepository repo;

    public EventService(EventRepository repo) {
        this.repo = repo;
    }

    public EventModel addEvent(EventModel eventModel, String facultyId) {
        if (eventModel.getEventDate() == null) {
            eventModel.setEventDate(LocalDate.now());
        }
        eventModel.setFacultyId(facultyId);
        return repo.save(eventModel);
    }

    public List<EventModel> getEventsByMonth(int year, int month, String facultyId) {
        YearMonth yearMonth = YearMonth.of(year, month);
        LocalDate startDate = yearMonth.atDay(1);
        LocalDate endDate = yearMonth.atEndOfMonth();

        List<EventModel> monthEvents = repo.findByEventDateBetween(startDate, endDate);

        return monthEvents.stream()
                .filter(event -> facultyId.equals(event.getFacultyId()))
                .toList();
    }

    public List<EventModel> getEventsByStudentRollNumber(String rollNumber, String role, String tokenRollNumber) {
        if ("FACULTY".equals(role)) {
            return repo.findByStudentRollNumber(rollNumber);
        }
        if ("STUDENT".equals(role) && rollNumber.equals(tokenRollNumber)) {
            return repo.findByStudentRollNumber(rollNumber);
        }
        throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
    }

    public List<EventModel> getEventsByFaculty(String facultyId) {
        return repo.findByFacultyId(facultyId);
    }

    public EventModel updateEvent(String eventId, String facultyId, EventUpdateRequest updateRequest) {
        Optional<EventModel> optionalEvent = repo.findById(eventId);
        if (optionalEvent.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Event not found");
        }

        EventModel existingEvent = optionalEvent.get();
        if (existingEvent.getFacultyId() == null || !existingEvent.getFacultyId().equals(facultyId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
        }

        existingEvent.setStudentName(updateRequest.getStudentName());
        existingEvent.setStudentRollNumber(updateRequest.getStudentRollNumber());
        existingEvent.setEventName(updateRequest.getEventName());
        existingEvent.setEventLocation(updateRequest.getEventLocation());
        existingEvent.setEventDate(updateRequest.getEventDate());
        existingEvent.setEventDescription(updateRequest.getEventDescription());
        existingEvent.setFacultyId(facultyId);

        return repo.save(existingEvent);
    }

    public boolean deleteEvent(String eventId, String facultyId) {
        Optional<EventModel> optionalEvent = repo.findById(eventId);
        if (optionalEvent.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Event not found");
        }

        EventModel eventModel = optionalEvent.get();
        if (eventModel.getFacultyId() == null || !eventModel.getFacultyId().equals(facultyId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
        }

        repo.deleteById(eventId);
        return true;
    }

    public EventModel getEventById(String eventId, String facultyId) {
        Optional<EventModel> optionalEvent = repo.findById(eventId);
        if (optionalEvent.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Event not found");
        }
        EventModel eventModel = optionalEvent.get();
        if (eventModel.getFacultyId() == null || !eventModel.getFacultyId().equals(facultyId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
        }
        return eventModel;
    }
}
