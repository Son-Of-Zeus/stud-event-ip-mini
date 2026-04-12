package com.example.studentevent.Security;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

@Component
public class JwtClaimUtils {

    public String requireFacultyId(Authentication authentication) {
        String role = getRole(authentication);
        if (!"FACULTY".equals(role)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
        }

        String facultyId = getFacultyId(authentication);
        if (facultyId == null || facultyId.isBlank()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
        }
        return facultyId;
    }

    public String getRole(Authentication authentication) {
        return getClaim(authentication, "role");
    }

    public String getFacultyId(Authentication authentication) {
        return getClaim(authentication, "facultyId");
    }

    public String getRollNumber(Authentication authentication) {
        return getClaim(authentication, "rollNumber");
    }

    private String getClaim(Authentication authentication, String claimName) {
        if (!(authentication instanceof JwtAuthenticationToken jwtToken)) {
            return null;
        }

        Map<String, Object> claims = jwtToken.getToken().getClaims();
        Object value = claims.get(claimName);
        return value != null ? String.valueOf(value) : null;
    }
}
