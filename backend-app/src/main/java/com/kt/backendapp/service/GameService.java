package com.kt.backendapp.service;

import com.kt.backendapp.dto.GameRequest;
import com.kt.backendapp.dto.GameResponse;
import com.kt.backendapp.entity.Game;
import com.kt.backendapp.entity.Team;
import com.kt.backendapp.enums.GameStatus;
import com.kt.backendapp.repository.GameRepository;
import com.kt.backendapp.repository.TeamRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class GameService {

    private final GameRepository gameRepository;
    private final TeamRepository teamRepository;
    private final TeamStandingService teamStandingService;

    /**
     * 모든 경기 조회
     */
    @Transactional(readOnly = true)
    public List<GameResponse> getAllGames() {
        List<Game> games = gameRepository.findAll();
        return games.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * 특정 경기 조회
     */
    @Transactional(readOnly = true)
    public GameResponse getGameById(UUID gameId) {
        Optional<Game> game = gameRepository.findById(gameId);
        return game.map(this::convertToResponse).orElse(null);
    }

    /**
     * 상태별 경기 조회
     */
    @Transactional(readOnly = true)
    public List<GameResponse> getGamesByStatus(GameStatus status) {
        List<Game> games = gameRepository.findByStatusOrderByDateTimeAsc(status);
        return games.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * 기간별 경기 조회
     */
    @Transactional(readOnly = true)
    public List<GameResponse> getGamesByDateRange(LocalDateTime start, LocalDateTime end) {
        List<Game> games = gameRepository.findByDateTimeBetweenOrderByDateTimeAsc(start, end);
        return games.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * 경기 생성
     */
    @Transactional
    public GameResponse createGame(GameRequest request) {
        log.info("새 경기 생성 시작");

        // 팀 조회
        Team homeTeam = teamRepository.findById(request.getHomeTeamId())
                .orElseThrow(() -> new IllegalArgumentException("홈팀을 찾을 수 없습니다."));
        Team awayTeam = teamRepository.findById(request.getAwayTeamId())
                .orElseThrow(() -> new IllegalArgumentException("원정팀을 찾을 수 없습니다."));

        // 경기 생성
        Game game = new Game();
        game.setDateTime(request.getDateTime());
        game.setHomeTeam(homeTeam);
        game.setAwayTeam(awayTeam);
        game.setStatus(request.getStatus() != null ? request.getStatus() : GameStatus.scheduled);
        game.setInning(request.getInning() != null ? request.getInning() : 0);
        game.setHomeScore(request.getHomeScore() != null ? request.getHomeScore() : 0);
        game.setAwayScore(request.getAwayScore() != null ? request.getAwayScore() : 0);
        game.setTicketPrice(request.getTicketPrice() != null ? request.getTicketPrice() : 0);

        Game savedGame = gameRepository.save(game);
        log.info("새 경기 생성 완료: {}", savedGame.getId());

        // 새 경기 생성 후 팀 순위 새로고침 (경기 수가 변경되었으므로)
        teamStandingService.updateAllTeamStandings();

        return convertToResponse(savedGame);
    }

    /**
     * 경기 수정
     */
    @Transactional
    public GameResponse updateGame(UUID gameId, GameRequest request) {
        log.info("경기 수정 시작: {}", gameId);

        Game game = gameRepository.findById(gameId)
                .orElseThrow(() -> new IllegalArgumentException("경기를 찾을 수 없습니다."));

        // 기존 상태 저장 (통계 업데이트 판단용)
        GameStatus oldStatus = game.getStatus();
        Integer oldHomeScore = game.getHomeScore();
        Integer oldAwayScore = game.getAwayScore();

        // 경기 정보 업데이트
        if (request.getDateTime() != null) {
            game.setDateTime(request.getDateTime());
        }
        if (request.getHomeTeamId() != null) {
            Team homeTeam = teamRepository.findById(request.getHomeTeamId())
                    .orElseThrow(() -> new IllegalArgumentException("홈팀을 찾을 수 없습니다."));
            game.setHomeTeam(homeTeam);
        }
        if (request.getAwayTeamId() != null) {
            Team awayTeam = teamRepository.findById(request.getAwayTeamId())
                    .orElseThrow(() -> new IllegalArgumentException("원정팀을 찾을 수 없습니다."));
            game.setAwayTeam(awayTeam);
        }
        if (request.getStatus() != null) {
            game.setStatus(request.getStatus());
        }
        if (request.getInning() != null) {
            game.setInning(request.getInning());
        }
        if (request.getHomeScore() != null) {
            game.setHomeScore(request.getHomeScore());
        }
        if (request.getAwayScore() != null) {
            game.setAwayScore(request.getAwayScore());
        }
        if (request.getTicketPrice() != null) {
            game.setTicketPrice(request.getTicketPrice());
        }

        Game updatedGame = gameRepository.save(game);

        // 경기 결과가 변경되었거나 상태가 변경된 경우 통계 업데이트
        if (shouldUpdateStandings(oldStatus, oldHomeScore, oldAwayScore, updatedGame)) {
            updateTeamStandings(updatedGame);
        }

        log.info("경기 수정 완료: {}", gameId);
        return convertToResponse(updatedGame);
    }

    /**
     * 경기 삭제
     */
    @Transactional
    public void deleteGame(UUID gameId) {
        log.info("경기 삭제 시작: {}", gameId);

        Game game = gameRepository.findById(gameId)
                .orElseThrow(() -> new IllegalArgumentException("경기를 찾을 수 없습니다."));

        // 삭제 전 관련 팀 정보 저장
        Team homeTeam = game.getHomeTeam();
        Team awayTeam = game.getAwayTeam();

        gameRepository.delete(game);

        // 경기 삭제 후 관련 팀 통계 업데이트
        teamStandingService.updateTeamStanding(homeTeam);
        teamStandingService.updateTeamStanding(awayTeam);
        teamStandingService.updateRankings();

        log.info("경기 삭제 완료: {}", gameId);
    }

    /**
     * 통계 업데이트가 필요한지 판단
     */
    private boolean shouldUpdateStandings(GameStatus oldStatus, Integer oldHomeScore, 
                                        Integer oldAwayScore, Game updatedGame) {
        // 상태가 ended로 변경되었거나
        boolean statusChanged = oldStatus != GameStatus.ended && updatedGame.getStatus() == GameStatus.ended;
        
        // 이미 ended 상태인 경기의 점수가 변경된 경우
        boolean scoreChanged = updatedGame.getStatus() == GameStatus.ended && 
                              (!oldHomeScore.equals(updatedGame.getHomeScore()) || 
                               !oldAwayScore.equals(updatedGame.getAwayScore()));

        return statusChanged || scoreChanged;
    }

    /**
     * 해당 경기의 팀들 통계 업데이트
     */
    private void updateTeamStandings(Game game) {
        teamStandingService.updateTeamStanding(game.getHomeTeam());
        teamStandingService.updateTeamStanding(game.getAwayTeam());
        teamStandingService.updateRankings();
    }

    /**
     * Entity를 Response DTO로 변환
     */
    private GameResponse convertToResponse(Game game) {
        GameResponse response = new GameResponse();
        response.setId(game.getId());
        response.setDateTime(game.getDateTime());
        response.setStatus(game.getStatus());
        response.setInning(game.getInning());
        response.setHomeScore(game.getHomeScore());
        response.setAwayScore(game.getAwayScore());
        response.setTicketPrice(game.getTicketPrice());
        response.setCreatedAt(game.getCreatedAt());
        response.setUpdatedAt(game.getUpdatedAt());

        // 홈팀 정보
        GameResponse.TeamDto homeTeamDto = new GameResponse.TeamDto();
        homeTeamDto.setId(game.getHomeTeam().getId());
        homeTeamDto.setName(game.getHomeTeam().getName());
        homeTeamDto.setShortName(game.getHomeTeam().getShortName());
        homeTeamDto.setLogoUrl(game.getHomeTeam().getLogoUrl());
        response.setHomeTeam(homeTeamDto);

        // 원정팀 정보
        GameResponse.TeamDto awayTeamDto = new GameResponse.TeamDto();
        awayTeamDto.setId(game.getAwayTeam().getId());
        awayTeamDto.setName(game.getAwayTeam().getName());
        awayTeamDto.setShortName(game.getAwayTeam().getShortName());
        awayTeamDto.setLogoUrl(game.getAwayTeam().getLogoUrl());
        response.setAwayTeam(awayTeamDto);

        // 경기장 정보 (홈팀의 경기장)
        if (game.getHomeTeam().getVenue() != null) {
            GameResponse.VenueDto venueDto = new GameResponse.VenueDto();
            venueDto.setId(game.getHomeTeam().getVenue().getId());
            venueDto.setName(game.getHomeTeam().getVenue().getName());
            venueDto.setLocation(game.getHomeTeam().getVenue().getLocation());
            venueDto.setCapacity(game.getHomeTeam().getVenue().getCapacity());
            response.setVenue(venueDto);
        }

        return response;
    }

    /**
     * 가장 가까운 경기 조회 (현재 시간 이후의 첫 번째 경기)
     */
    public GameResponse getNextGame() {
        log.debug("가장 가까운 경기 조회");
        
        LocalDateTime now = LocalDateTime.now();
        List<Game> upcomingGames = gameRepository.findByDateTimeAfterOrderByDateTimeAsc(now);
        
        if (upcomingGames.isEmpty()) {
            // 예정된 경기가 없으면 가장 최근 경기 반환
            List<Game> recentGames = gameRepository.findTop1ByOrderByDateTimeDesc();
            if (recentGames.isEmpty()) {
                log.info("조회할 경기가 없습니다");
                return null;
            }
            log.info("예정된 경기가 없어 가장 최근 경기 반환");
            return convertToResponse(recentGames.get(0));
        }
        
        Game nextGame = upcomingGames.get(0);
        log.info("가장 가까운 경기 조회 완료: {}", nextGame.getId());
        return convertToResponse(nextGame);
    }

    /**
     * KT Wiz의 최근 종료된 경기 조회
     */
    @Transactional(readOnly = true)
    public GameResponse getKtWizLatestEndedGame() {
        log.info("KT Wiz의 최근 종료된 경기 조회 시작");
        
        // KT Wiz ID (UUID: 20000000-0000-0000-0000-000000000008)
        UUID ktWizId = UUID.fromString("20000000-0000-0000-0000-000000000008");
        
        // KT Wiz가 참여한 종료된 경기 중 가장 최근 경기 조회
        List<Game> endedGames = gameRepository.findByTeamIdAndStatusOrderByDateTimeDesc(ktWizId, GameStatus.ended);
        
        log.info("KT Wiz 종료된 경기 총 {}개 발견", endedGames.size());
        
        if (endedGames.isEmpty()) {
            log.warn("KT Wiz의 종료된 경기가 없습니다");
            return null;
        }
        
        Game game = endedGames.get(0); // 가장 최근 경기
        log.info("KT Wiz의 최근 종료된 경기 조회 완료: ID={}, 날짜={}, 홈팀={}, 원정팀={}", 
                game.getId(), game.getDateTime(), game.getHomeTeam().getName(), game.getAwayTeam().getName());
        return convertToResponse(game);
    }

    /**
     * 팀과 상태로 경기 필터링
     */
    @Transactional(readOnly = true)
    public List<GameResponse> getGamesByTeamsAndStatuses(List<UUID> teamIds, List<GameStatus> statuses) {
        log.debug("팀과 상태로 경기 필터링: 팀 {}개, 상태 {}개", 
                teamIds != null ? teamIds.size() : 0, 
                statuses != null ? statuses.size() : 0);
        
        // 간단한 필터링 로직
        if ((teamIds == null || teamIds.isEmpty()) && (statuses == null || statuses.isEmpty())) {
            // 필터가 없으면 모든 경기 반환
            List<Game> allGames = gameRepository.findAll();
            return allGames.stream()
                    .map(this::convertToResponse)
                    .collect(Collectors.toList());
        }
        
        // 팀 ID가 있는 경우
        if (teamIds != null && !teamIds.isEmpty()) {
            List<Game> games = gameRepository.findByHomeTeamIdInOrAwayTeamIdInAndStatusInOrderByDateTimeAsc(
                teamIds, teamIds, statuses != null ? statuses : List.of());
            return games.stream()
                    .map(this::convertToResponse)
                    .collect(Collectors.toList());
        }
        
        // 상태만 있는 경우
        if (statuses != null && !statuses.isEmpty()) {
            List<Game> games = gameRepository.findByStatusInOrderByDateTimeAsc(statuses);
            return games.stream()
                    .map(this::convertToResponse)
                    .collect(Collectors.toList());
        }
        
        return List.of();
    }
}
