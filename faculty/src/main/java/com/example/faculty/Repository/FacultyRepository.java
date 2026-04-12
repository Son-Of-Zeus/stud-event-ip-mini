package com.example.faculty.Repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.example.faculty.Model.FacultyModel;

@Repository
public interface FacultyRepository extends MongoRepository<FacultyModel, String> {

    FacultyModel findByEmailId(String emailId);

    FacultyModel findByFacultyId(String facultyId);
}
