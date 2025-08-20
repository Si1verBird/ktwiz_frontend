package com.kt.backendapp.controller;

import com.kt.backendapp.dto.VenueResponse;
import com.kt.backendapp.service.VenueService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/venues")
@RequiredArgsConstructor
@Slf4j
public class VenueController {

    private final VenueService venueService;

    @GetMapping
    public ResponseEntity<List<VenueResponse>> getAllVenues() {
        log.info("모든 구장 조회 요청");
        List<VenueResponse> venues = venueService.getAllVenues();
        return ResponseEntity.ok(venues);
    }

    @GetMapping("/{id}")
    public ResponseEntity<VenueResponse> getVenueById(@PathVariable UUID id) {
        log.info("구장 조회 요청: {}", id);
        VenueResponse venue = venueService.getVenueById(id);
        return ResponseEntity.ok(venue);
    }
}
