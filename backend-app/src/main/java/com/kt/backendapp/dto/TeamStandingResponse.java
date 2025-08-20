package com.kt.backendapp.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class TeamStandingResponse {
    private UUID teamId;
    private String teamName;
    private String teamShortName;
    private Integer gamesPlayed;
    private Integer wins;
    private Integer losses;
    private Double winRate;
    private Integer rank;
    private LocalDateTime updatedAt;
}
