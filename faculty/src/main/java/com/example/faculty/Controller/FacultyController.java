package com.example.faculty.Controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.Authentication;

import com.example.faculty.Model.AuthResponse;
import com.example.faculty.Model.FacultyLoginRequest;
import com.example.faculty.Model.FacultyModel;
import com.example.faculty.Security.JwtClaimUtils;
import com.example.faculty.Service.FacultyService;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/faculty")
public class FacultyController {

    private final FacultyService service;
    private final JwtClaimUtils jwtClaimUtils;

    public FacultyController(FacultyService service, JwtClaimUtils jwtClaimUtils) {
        this.service = service;
        this.jwtClaimUtils = jwtClaimUtils;
    }

    @PostMapping("/register")
    public FacultyModel registerFaculty(@RequestBody FacultyModel facultyModel) {
        return service.registerFaculty(facultyModel);
    }

    @PostMapping("/login")
    public AuthResponse loginFaculty(@RequestBody FacultyLoginRequest loginRequest) {
        return service.loginFaculty(loginRequest.getEmailId(), loginRequest.getPassword());
    }

    @GetMapping("/{facultyId}")
    public FacultyModel getByFacultyId(@PathVariable String facultyId, Authentication authentication) {
        jwtClaimUtils.validateSelf(authentication, facultyId);
        return service.findByFacultyId(facultyId);
    }
}
