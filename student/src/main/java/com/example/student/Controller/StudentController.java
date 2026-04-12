package com.example.student.Controller;

import java.util.List;

import org.springframework.http.HttpHeaders;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.student.Model.AuthResponse;
import com.example.student.Model.StudentEventModel;
import com.example.student.Model.StudentLoginRequest;
import com.example.student.Model.StudentModel;
import com.example.student.Security.JwtClaimUtils;
import com.example.student.Service.StudentService;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/student")
public class StudentController {

    private final StudentService service;
    private final JwtClaimUtils jwtClaimUtils;

    public StudentController(StudentService service, JwtClaimUtils jwtClaimUtils) {
        this.service = service;
        this.jwtClaimUtils = jwtClaimUtils;
    }

    @PostMapping("/register")
    public StudentModel registerStudent(@RequestBody StudentModel studentModel) {
        return service.registerStudent(studentModel);
    }

    @PostMapping("/login")
    public AuthResponse loginStudent(@RequestBody StudentLoginRequest loginRequest) {
        return service.loginStudent(loginRequest.getEmailId(), loginRequest.getPassword());
    }

    @GetMapping("/{rollNumber}")
    public StudentModel getByRollNumber(@PathVariable String rollNumber, Authentication authentication) {
        jwtClaimUtils.validateSelfOrFaculty(authentication, rollNumber);
        return service.findByRollNumber(rollNumber);
    }

    @GetMapping("/events/{rollNumber}")
    public List<StudentEventModel> getStudentEvents(
            @PathVariable String rollNumber,
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorizationHeader,
            Authentication authentication) {
        jwtClaimUtils.validateSelfOrFaculty(authentication, rollNumber);
        return service.getStudentEvents(rollNumber, authorizationHeader);
    }
}
