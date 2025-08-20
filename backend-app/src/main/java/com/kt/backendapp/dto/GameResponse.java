package com.kt.backendapp.dto;

import com.kt.backendapp.enums.GameStatus;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class GameResponse {
    private UUID id;
    private LocalDateTime dateTime;
    private TeamDto homeTeam;
    private TeamDto awayTeam;
    private GameStatus status;
    private Integer inning;
    private Integer homeScore;
    private Integer awayScore;
    private Integer ticketPrice;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Data
    public static class TeamDto {
        private UUID id;
        private String name;
        private String shortName;
    }
}
