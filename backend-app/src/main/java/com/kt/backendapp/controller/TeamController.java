package com.kt.backendapp.controller;

import com.kt.backendapp.dto.TeamResponse;
import com.kt.backendapp.service.TeamService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/teams")
@RequiredArgsConstructor
@Slf4j
public class TeamController {

    private final TeamService teamService;

    /**
     * 모든 팀 조회
     */
    @GetMapping
    public ResponseEntity<List<TeamResponse>> getAllTeams() {
        log.info("모든 팀 조회 요청");
        List<TeamResponse> teams = teamService.getAllTeams();
        return ResponseEntity.ok(teams);
    }

    /**
     * 특정 팀 조회
     */
    @GetMapping("/{id}")
    public ResponseEntity<TeamResponse> getTeamById(@PathVariable UUID id) {
        log.info("팀 조회 요청: {}", id);
        TeamResponse team = teamService.getTeamById(id);
        return ResponseEntity.ok(team);
    }
}
