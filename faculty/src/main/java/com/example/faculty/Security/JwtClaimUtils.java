package com.example.faculty.Security;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

@Component
public class JwtClaimUtils {

    public void validateSelf(Authentication authentication, String requestedFacultyId) {
        String role = getClaim(authentication, "role");
        if (!"FACULTY".equals(role)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
        }

        String tokenFacultyId = getClaim(authentication, "facultyId");
        if (tokenFacultyId == null || !tokenFacultyId.equals(requestedFacultyId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
        }
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
