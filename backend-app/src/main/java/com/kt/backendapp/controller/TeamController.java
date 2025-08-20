package com.kt.backendapp.controller;

import com.kt.backendapp.entity.Team;
import com.kt.backendapp.repository.TeamRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teams")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Slf4j
public class TeamController {

    private final TeamRepository teamRepository;

    /**
     * 모든 팀 조회
     */
    @GetMapping
    public ResponseEntity<List<Team>> getAllTeams() {
        log.info("모든 팀 조회 요청");
        List<Team> teams = teamRepository.findAll();
        return ResponseEntity.ok(teams);
    }
}
