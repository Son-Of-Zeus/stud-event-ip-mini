package com.example.student.Service;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;

import com.example.student.Model.StudentEventModel;

@Service
public class EventClientService {

    private final RestTemplate restTemplate;
    private final String eventServiceBaseUrl;

    public EventClientService(RestTemplate restTemplate,
            @Value("${event.service.url:http://localhost:8083}") String eventServiceBaseUrl) {
        this.restTemplate = restTemplate;
        this.eventServiceBaseUrl = eventServiceBaseUrl;
    }

    public List<StudentEventModel> getEventsByRollNumber(String rollNumber, String authorizationHeader) {
        String url = eventServiceBaseUrl + "/api/event/student/" + rollNumber;

        try {
            HttpHeaders headers = new HttpHeaders();
            if (authorizationHeader != null && !authorizationHeader.isBlank()) {
                headers.set(HttpHeaders.AUTHORIZATION, authorizationHeader);
            }
            HttpEntity<Void> requestEntity = new HttpEntity<>(headers);
            ResponseEntity<StudentEventModel[]> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    requestEntity,
                    StudentEventModel[].class);
            if (!response.getStatusCode().is2xxSuccessful()) {
                throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Failed to fetch events");
            }

            StudentEventModel[] body = response.getBody();
            if (body == null) {
                return Collections.emptyList();
            }
            return Arrays.asList(body);
        } catch (HttpStatusCodeException ex) {
            HttpStatusCode statusCode = ex.getStatusCode();
            if (statusCode.is4xxClientError()) {
                throw new ResponseStatusException(statusCode, "Event service rejected the request");
            }
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Event service failed");
        } catch (RestClientException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Unable to reach event service");
        }
    }
}
