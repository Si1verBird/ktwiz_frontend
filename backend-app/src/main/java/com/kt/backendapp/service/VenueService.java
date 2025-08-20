package com.kt.backendapp.service;

import com.kt.backendapp.dto.VenueResponse;
import com.kt.backendapp.entity.Venue;
import com.kt.backendapp.repository.VenueRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class VenueService {

    private final VenueRepository venueRepository;

    public List<VenueResponse> getAllVenues() {
        log.debug("모든 구장 조회");
        List<Venue> venues = venueRepository.findAll();
        return venues.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public VenueResponse getVenueById(UUID id) {
        log.debug("구장 조회: {}", id);
        Venue venue = venueRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("구장을 찾을 수 없습니다: " + id));
        return convertToResponse(venue);
    }

    private VenueResponse convertToResponse(Venue venue) {
        return VenueResponse.builder()
                .id(venue.getId())
                .name(venue.getName())
                .location(venue.getLocation())
                .capacity(venue.getCapacity())
                .createdAt(venue.getCreatedAt())
                .build();
    }
}
