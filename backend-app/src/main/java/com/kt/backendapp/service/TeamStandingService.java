package com.kt.backendapp.service;

import com.kt.backendapp.dto.TeamStandingResponse;
import com.kt.backendapp.entity.Team;
import com.kt.backendapp.entity.TeamStanding;
import com.kt.backendapp.repository.GameRepository;
import com.kt.backendapp.repository.TeamRepository;
import com.kt.backendapp.repository.TeamStandingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class TeamStandingService {

    private final TeamStandingRepository teamStandingRepository;
    private final GameRepository gameRepository;
    private final TeamRepository teamRepository;

    /**
     * 모든 팀의 순위표를 조회
     */
    @Transactional(readOnly = true)
    public List<TeamStandingResponse> getAllTeamStandings() {
        List<TeamStanding> standings = teamStandingRepository.findAllOrderByRanking();
        return standings.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * 특정 팀의 순위 정보 조회
     */
    @Transactional(readOnly = true)
    public TeamStandingResponse getTeamStandingByName(String teamName) {
        TeamStanding standing = teamStandingRepository.findByTeamName(teamName);
        if (standing == null) {
            return null;
        }
        return convertToResponse(standing);
    }

    /**
     * 특정 팀의 통계 업데이트
     */
    @Transactional
    public void updateTeamStanding(Team team) {
        log.info("팀 통계 업데이트 시작: {}", team.getName());

        // 경기 통계 계산
        Long gamesPlayed = gameRepository.countCompletedGamesByTeam(team);
        Long wins = gameRepository.countWinsByTeam(team);
        Long losses = gameRepository.countLossesByTeam(team);
        
        // 승률 계산
        double winRate = gamesPlayed > 0 ? (double) wins / gamesPlayed : 0.0;

        // 기존 통계 조회 또는 새로 생성
        TeamStanding standing = teamStandingRepository.findById(team.getId())
                .orElse(TeamStanding.builder()
                        .teamId(team.getId())
                        .team(team)
                        .gamesPlayed(0)
                        .wins(0)
                        .losses(0)
                        .winRate(0.0)
                        .build());

        // 기존 객체의 경우 필드 업데이트
        standing.setTeamId(team.getId());
        standing.setTeam(team);
        standing.setGamesPlayed(gamesPlayed.intValue());
        standing.setWins(wins.intValue());
        standing.setLosses(losses.intValue());
        standing.setWinRate(winRate);

        teamStandingRepository.save(standing);
        
        log.info("팀 통계 업데이트 완료: {} - 경기수: {}, 승: {}, 패: {}, 승률: {}", 
                team.getName(), gamesPlayed, wins, losses, winRate);
    }

    /**
     * 모든 팀의 통계 업데이트
     */
    @Transactional
    public void updateAllTeamStandings() {
        log.info("모든 팀 통계 업데이트 시작");
        
        List<Team> allTeams = teamRepository.findAll();
        for (Team team : allTeams) {
            updateTeamStanding(team);
        }
        
        // 순위 재계산
        updateRankings();
        
        log.info("모든 팀 통계 업데이트 완료");
    }

    /**
     * 순위 재계산
     */
    @Transactional
    public void updateRankings() {
        List<TeamStanding> standings = teamStandingRepository.findAllOrderByRanking();
        
        for (int i = 0; i < standings.size(); i++) {
            standings.get(i).setRank(i + 1);
            teamStandingRepository.save(standings.get(i));
        }
    }

    /**
     * Entity를 Response DTO로 변환
     */
    private TeamStandingResponse convertToResponse(TeamStanding standing) {
        TeamStandingResponse response = new TeamStandingResponse();
        response.setTeamId(standing.getTeamId());
        response.setTeamName(standing.getTeam().getName());
        response.setTeamShortName(standing.getTeam().getShortName());
        response.setGamesPlayed(standing.getGamesPlayed());
        response.setWins(standing.getWins());
        response.setLosses(standing.getLosses());
        response.setWinRate(standing.getWinRate());
        response.setRank(standing.getRank());
        response.setUpdatedAt(standing.getUpdatedAt());
        return response;
    }
}
