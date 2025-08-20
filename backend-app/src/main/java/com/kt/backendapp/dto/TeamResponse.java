package com.kt.backendapp.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TeamResponse {
    private UUID id;
    private String name;
    private String shortName;
    private VenueDto venue;
    private LocalDateTime createdAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class VenueDto {
        private UUID id;
        private String name;
        private String location;
        private Integer capacity;
    }
}
