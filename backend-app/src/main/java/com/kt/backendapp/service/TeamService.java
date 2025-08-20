package com.kt.backendapp.service;

import com.kt.backendapp.dto.TeamResponse;
import com.kt.backendapp.entity.Team;
import com.kt.backendapp.repository.TeamRepository;
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
public class TeamService {

    private final TeamRepository teamRepository;

    public List<TeamResponse> getAllTeams() {
        log.debug("모든 팀 조회");
        List<Team> teams = teamRepository.findAll();
        return teams.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public TeamResponse getTeamById(UUID id) {
        log.debug("팀 조회: {}", id);
        Team team = teamRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("팀을 찾을 수 없습니다: " + id));
        return convertToResponse(team);
    }

    private TeamResponse convertToResponse(Team team) {
        return TeamResponse.builder()
                .id(team.getId())
                .name(team.getName())
                .shortName(team.getShortName())
                .venue(team.getVenue() != null ? TeamResponse.VenueDto.builder()
                        .id(team.getVenue().getId())
                        .name(team.getVenue().getName())
                        .location(team.getVenue().getLocation())
                        .capacity(team.getVenue().getCapacity())
                        .build() : null)
                .createdAt(team.getCreatedAt())
                .build();
    }
}
