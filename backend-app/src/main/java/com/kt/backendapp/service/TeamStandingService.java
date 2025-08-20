package com.kt.backendapp.service;

import com.kt.backendapp.dto.TeamStandingResponse;
import com.kt.backendapp.entity.Team;
import com.kt.backendapp.entity.TeamStanding;
import com.kt.backendapp.enums.GameStatus;
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

        try {
            // 경기 통계 계산
            log.debug("팀 {} 경기 통계 계산 시작", team.getName());
            Long gamesPlayed = gameRepository.countCompletedGamesByTeam(team, GameStatus.ended);
            Long wins = gameRepository.countWinsByTeam(team, GameStatus.ended);
            Long losses = gameRepository.countLossesByTeam(team, GameStatus.ended);
            log.debug("팀 {} 경기 통계 계산 완료 - 경기수: {}, 승: {}, 패: {}", 
                    team.getName(), gamesPlayed, wins, losses);
            
            // 승률 계산
            double winRate = gamesPlayed > 0 ? (double) wins / gamesPlayed : 0.0;
            log.debug("팀 {} 승률 계산: {}", team.getName(), winRate);

            // 기존 통계 조회 또는 새로 생성
            TeamStanding standing = teamStandingRepository.findById(team.getId())
                    .orElse(TeamStanding.builder()
                            .teamId(team.getId())
                            .team(team)
                            .gamesPlayed(0)
                            .wins(0)
                            .losses(0)
                            .winRate(0.0)
                            .build());  // rank는 나중에 updateRankings에서 설정

            // 기존 객체의 경우 필드 업데이트
            standing.setTeamId(team.getId());
            standing.setTeam(team);
            standing.setGamesPlayed(gamesPlayed.intValue());
            standing.setWins(wins.intValue());
            standing.setLosses(losses.intValue());
            standing.setWinRate(winRate);

            teamStandingRepository.save(standing);
            log.debug("팀 {} TeamStanding 저장 완료", team.getName());
            
            log.info("팀 통계 업데이트 완료: {} - 경기수: {}, 승: {}, 패: {}, 승률: {}", 
                    team.getName(), gamesPlayed, wins, losses, winRate);
                    
        } catch (Exception e) {
            log.error("팀 {} 통계 업데이트 중 오류 발생: {}", team.getName(), e.getMessage(), e);
            throw e;
        }
    }

    /**
     * 모든 팀의 통계 업데이트
     */
    @Transactional
    public void updateAllTeamStandings() {
        log.info("모든 팀 통계 업데이트 시작");
        
        try {
            List<Team> allTeams = teamRepository.findAll();
            log.info("총 {} 개의 팀 조회 완료", allTeams.size());
            
            for (Team team : allTeams) {
                log.info("팀 {} 통계 업데이트 시작", team.getName());
                updateTeamStanding(team);
                log.info("팀 {} 통계 업데이트 완료", team.getName());
            }
            
            // 순위 재계산
            log.info("순위 재계산 시작");
            updateRankings();
            log.info("순위 재계산 완료");
            
        } catch (Exception e) {
            log.error("팀 통계 업데이트 중 오류 발생: {}", e.getMessage(), e);
            throw e;
        }
        
        log.info("모든 팀 통계 업데이트 완료");
    }

    /**
     * 간단한 초기화 (테스트용)
     */
    @Transactional
    public void initializeTeamStandings() {
        log.info("팀 순위 테이블 초기화 시작");
        
        List<Team> allTeams = teamRepository.findAll();
        log.info("총 {} 개의 팀으로 초기화", allTeams.size());
        
        for (Team team : allTeams) {
            TeamStanding standing = TeamStanding.builder()
                    .teamId(team.getId())
                    .team(team)  // LAZY 로딩이지만 @Transactional 내에서는 접근 가능
                    .gamesPlayed(0)
                    .wins(0)
                    .losses(0)
                    .winRate(0.0)
                    .rank(1)
                    .build();
            
            teamStandingRepository.save(standing);
            log.info("팀 {} 초기 데이터 생성", team.getName());
        }
        
        log.info("팀 순위 테이블 초기화 완료");
    }

    /**
     * 순위 재계산
     */
    @Transactional
    public void updateRankings() {
        log.info("순위 재계산 시작");
        
        // 모든 팀 순위 정보 조회
        List<TeamStanding> standings = teamStandingRepository.findAll();
        log.info("총 {} 개의 팀 순위 정보 조회", standings.size());
        
        if (standings.isEmpty()) {
            log.warn("순위를 계산할 팀이 없습니다");
            return;
        }
        
        // winRate 기준으로 내림차순 정렬 (승률이 높은 팀이 1위)
        standings.sort((a, b) -> {
            // 승률 비교 (내림차순)
            int winRateCompare = Double.compare(b.getWinRate(), a.getWinRate());
            if (winRateCompare != 0) return winRateCompare;
            
            // 승률이 같으면 승수 비교 (내림차순)
            return Integer.compare(b.getWins(), a.getWins());
        });
        
        // 순위 설정 (1위부터 시작)
        for (int i = 0; i < standings.size(); i++) {
            TeamStanding standing = standings.get(i);
            int rank = i + 1;
            standing.setRank(rank);
            teamStandingRepository.save(standing);
            log.info("팀 {} 순위 설정: {}위 (승률: {:.3f}, 승: {}, 패: {})", 
                    standing.getTeam().getName(), rank, standing.getWinRate(), standing.getWins(), standing.getLosses());
        }
        
        log.info("순위 재계산 완료 - 총 {}개 팀", standings.size());
    }

    /**
     * Entity를 Response DTO로 변환
     */
    @Transactional(readOnly = true)
    private TeamStandingResponse convertToResponse(TeamStanding standing) {
        TeamStandingResponse response = new TeamStandingResponse();
        response.setTeamId(standing.getTeamId());
        
        // LAZY 로딩된 team 필드에 접근
        Team team = standing.getTeam();
        response.setTeamName(team.getName());
        response.setTeamShortName(team.getShortName());
        
        response.setGamesPlayed(standing.getGamesPlayed());
        response.setWins(standing.getWins());
        response.setLosses(standing.getLosses());
        response.setWinRate(standing.getWinRate());
        response.setRank(standing.getRank());
        response.setUpdatedAt(standing.getUpdatedAt());
        return response;
    }
}
