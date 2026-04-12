package com.example.faculty.Service;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.faculty.Model.AuthResponse;
import com.example.faculty.Model.FacultyModel;
import com.example.faculty.Repository.FacultyRepository;
import com.example.faculty.Security.JwtTokenService;

@Service
public class FacultyService {

    private final FacultyRepository repo;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenService jwtTokenService;

    public FacultyService(FacultyRepository repo,
            PasswordEncoder passwordEncoder,
            JwtTokenService jwtTokenService) {
        this.repo = repo;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenService = jwtTokenService;
    }

    public FacultyModel registerFaculty(FacultyModel facultyModel) {
        if (facultyModel == null || facultyModel.getPassword() == null || facultyModel.getPassword().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password is required");
        }
        if (repo.findByEmailId(facultyModel.getEmailId()) != null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email is already registered");
        }
        if (repo.findByFacultyId(facultyModel.getFacultyId()) != null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Faculty ID is already registered");
        }

        facultyModel.setPassword(passwordEncoder.encode(facultyModel.getPassword()));
        return repo.save(facultyModel);
    }

    public AuthResponse loginFaculty(String emailId, String password) {
        FacultyModel faculty = repo.findByEmailId(emailId);
        if (faculty == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }

        String storedPassword = faculty.getPassword();
        boolean isAuthenticated = false;
        try {
            isAuthenticated = passwordEncoder.matches(password, storedPassword);
        } catch (IllegalArgumentException ignored) {
            isAuthenticated = false;
        }

        if (!isAuthenticated && storedPassword != null && storedPassword.equals(password)) {
            faculty.setPassword(passwordEncoder.encode(password));
            repo.save(faculty);
            isAuthenticated = true;
        }

        if (!isAuthenticated) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }

        String accessToken = jwtTokenService.generateFacultyToken(faculty.getEmailId(), faculty.getFacultyId());
        return new AuthResponse(
                accessToken,
                "Bearer",
                jwtTokenService.getAccessTokenTtlSeconds(),
                faculty.getFacultyName(),
                faculty.getFacultyId(),
                faculty.getEmailId());
    }

    public FacultyModel findByFacultyId(String facultyId) {
        FacultyModel faculty = repo.findByFacultyId(facultyId);
        if (faculty == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Faculty not found");
        }
        return faculty;
    }
}
