package com.example.student.Service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.student.Model.AuthResponse;
import com.example.student.Model.StudentEventModel;
import com.example.student.Model.StudentModel;
import com.example.student.Repository.StudentRepository;
import com.example.student.Security.JwtTokenService;

@Service
public class StudentService {

    private final StudentRepository repo;
    private final EventClientService eventClientService;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenService jwtTokenService;

    public StudentService(StudentRepository repo,
            EventClientService eventClientService,
            PasswordEncoder passwordEncoder,
            JwtTokenService jwtTokenService) {
        this.repo = repo;
        this.eventClientService = eventClientService;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenService = jwtTokenService;
    }

    public StudentModel registerStudent(StudentModel studentModel) {
        if (studentModel == null || studentModel.getPassword() == null || studentModel.getPassword().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password is required");
        }
        if (repo.findByEmailId(studentModel.getEmailId()) != null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email is already registered");
        }
        if (repo.findByRollNumber(studentModel.getRollNumber()) != null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Roll number is already registered");
        }

        studentModel.setPassword(passwordEncoder.encode(studentModel.getPassword()));
        return repo.save(studentModel);
    }

    public AuthResponse loginStudent(String emailId, String password) {
        StudentModel student = repo.findByEmailId(emailId);
        if (student == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }

        String storedPassword = student.getPassword();
        boolean isAuthenticated = false;
        try {
            isAuthenticated = passwordEncoder.matches(password, storedPassword);
        } catch (IllegalArgumentException ignored) {
            isAuthenticated = false;
        }

        if (!isAuthenticated && storedPassword != null && storedPassword.equals(password)) {
            student.setPassword(passwordEncoder.encode(password));
            repo.save(student);
            isAuthenticated = true;
        }

        if (!isAuthenticated) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }

        String accessToken = jwtTokenService.generateStudentToken(student.getEmailId(), student.getRollNumber());
        return new AuthResponse(
                accessToken,
                "Bearer",
                jwtTokenService.getAccessTokenTtlSeconds(),
                student.getStudentName(),
                student.getRollNumber(),
                student.getEmailId());
    }

    public StudentModel findByRollNumber(String rollNumber) {
        StudentModel student = repo.findByRollNumber(rollNumber);
        if (student == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Student not found");
        }
        return student;
    }

    public List<StudentEventModel> getStudentEvents(String rollNumber, String authorizationHeader) {
        return eventClientService.getEventsByRollNumber(rollNumber, authorizationHeader);
    }
}
