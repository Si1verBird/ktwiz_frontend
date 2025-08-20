package com.kt.backendapp.dto;

import com.kt.backendapp.enums.GameStatus;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class GameRequest {
    private LocalDateTime dateTime;
    private UUID homeTeamId;
    private UUID awayTeamId;
    private GameStatus status;
    private Integer inning;
    private Integer homeScore;
    private Integer awayScore;
    private Integer ticketPrice;
}
