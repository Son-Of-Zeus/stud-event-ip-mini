package com.example.studentevent.Repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.example.studentevent.Model.EventModel;

@Repository
public interface EventRepository extends MongoRepository<EventModel, String> {

    List<EventModel> findByStudentRollNumber(String studentRollNumber);

    List<EventModel> findByFacultyId(String facultyId);

    List<EventModel> findByEventDateBetween(LocalDate startDate, LocalDate endDate);
}
