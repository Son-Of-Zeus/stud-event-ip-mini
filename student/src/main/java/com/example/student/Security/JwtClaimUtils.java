package com.example.student.Security;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

@Component
public class JwtClaimUtils {

    public void validateSelfOrFaculty(Authentication authentication, String requestedRollNumber) {
        String role = getClaim(authentication, "role");
        if ("FACULTY".equals(role)) {
            return;
        }

        if (!"STUDENT".equals(role)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
        }

        String tokenRollNumber = getClaim(authentication, "rollNumber");
        if (tokenRollNumber == null || !tokenRollNumber.equals(requestedRollNumber)) {
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
