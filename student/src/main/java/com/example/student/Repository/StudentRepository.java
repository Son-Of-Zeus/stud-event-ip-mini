package com.example.student.Repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.example.student.Model.StudentModel;

@Repository
public interface StudentRepository extends MongoRepository<StudentModel, String> {

    StudentModel findByEmailId(String emailId);

    StudentModel findByRollNumber(String rollNumber);
}
