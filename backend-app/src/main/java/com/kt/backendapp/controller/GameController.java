package com.kt.backendapp.controller;

import com.kt.backendapp.dto.GameRequest;
import com.kt.backendapp.dto.GameResponse;
import com.kt.backendapp.enums.GameStatus;
import com.kt.backendapp.service.GameService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/games")
@RequiredArgsConstructor
@Slf4j
public class GameController {

    private final GameService gameService;

    /**
     * 모든 경기 조회
     */
    @GetMapping
    public ResponseEntity<List<GameResponse>> getAllGames() {
        log.info("모든 경기 조회 요청");
        List<GameResponse> games = gameService.getAllGames();
        return ResponseEntity.ok(games);
    }

    /**
     * 특정 경기 조회
     */
    @GetMapping("/{gameId}")
    public ResponseEntity<GameResponse> getGameById(@PathVariable UUID gameId) {
        log.info("경기 조회 요청: {}", gameId);
        GameResponse game = gameService.getGameById(gameId);
        
        if (game == null) {
            return ResponseEntity.notFound().build();
        }
        
        return ResponseEntity.ok(game);
    }

    /**
     * 상태별 경기 조회
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<List<GameResponse>> getGamesByStatus(@PathVariable GameStatus status) {
        log.info("상태별 경기 조회 요청: {}", status);
        List<GameResponse> games = gameService.getGamesByStatus(status);
        return ResponseEntity.ok(games);
    }

    /**
     * 기간별 경기 조회
     */
    @GetMapping("/date-range")
    public ResponseEntity<List<GameResponse>> getGamesByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        log.info("기간별 경기 조회 요청: {} ~ {}", start, end);
        List<GameResponse> games = gameService.getGamesByDateRange(start, end);
        return ResponseEntity.ok(games);
    }

    /**
     * 가장 가까운 경기 조회 (메인페이지용)
     */
    @GetMapping("/next")
    public ResponseEntity<GameResponse> getNextGame() {
        log.info("가장 가까운 경기 조회 요청");
        
        GameResponse nextGame = gameService.getNextGame();
        if (nextGame == null) {
            log.info("예정된 경기가 없습니다");
            return ResponseEntity.notFound().build();
        }
        
        log.info("가장 가까운 경기: {}", nextGame.getId());
        return ResponseEntity.ok(nextGame);
    }

    /**
     * KT Wiz의 최근 종료된 경기 조회 (메인페이지 game schedule용)
     */
    @GetMapping("/kt-wiz/latest-ended")
    public ResponseEntity<GameResponse> getKtWizLatestEndedGame() {
        log.info("KT Wiz의 최근 종료된 경기 조회 요청");
        
        GameResponse latestGame = gameService.getKtWizLatestEndedGame();
        if (latestGame == null) {
            log.info("KT Wiz의 종료된 경기가 없습니다");
            return ResponseEntity.notFound().build();
        }
        
        log.info("KT Wiz의 최근 종료된 경기: {}", latestGame.getId());
        return ResponseEntity.ok(latestGame);
    }

    /**
     * 팀과 상태로 경기 필터링
     */
    @GetMapping("/filter")
    public ResponseEntity<List<GameResponse>> getGamesByFilter(
            @RequestParam(required = false) List<UUID> teamIds,
            @RequestParam(required = false) List<GameStatus> statuses) {
        log.info("경기 필터링 요청 - 팀: {}, 상태: {}", teamIds, statuses);
        
        List<GameResponse> games = gameService.getGamesByTeamsAndStatuses(teamIds, statuses);
        return ResponseEntity.ok(games);
    }

    /**
     * 경기 생성
     */
    @PostMapping
    public ResponseEntity<GameResponse> createGame(@RequestBody GameRequest request) {
        log.info("경기 생성 요청 시작");
        log.info("요청 데이터: dateTime={}, homeTeamId={}, awayTeamId={}, status={}, ticketPrice={}", 
                request.getDateTime(), request.getHomeTeamId(), request.getAwayTeamId(), 
                request.getStatus(), request.getTicketPrice());
        
        try {
            GameResponse createdGame = gameService.createGame(request);
            log.info("경기 생성 성공: {}", createdGame.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(createdGame);
        } catch (IllegalArgumentException e) {
            log.error("경기 생성 실패 (잘못된 요청): {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            log.error("경기 생성 실패 (서버 오류): ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * 경기 수정
     */
    @PutMapping("/{gameId}")
    public ResponseEntity<GameResponse> updateGame(
            @PathVariable UUID gameId,
            @RequestBody GameRequest request) {
        log.info("경기 수정 요청: {} - {}", gameId, request);
        
        try {
            GameResponse updatedGame = gameService.updateGame(gameId, request);
            return ResponseEntity.ok(updatedGame);
        } catch (IllegalArgumentException e) {
            log.error("경기 수정 실패: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }



    /**
     * 경기 삭제
     */
    @DeleteMapping("/{gameId}")
    public ResponseEntity<Void> deleteGame(@PathVariable UUID gameId) {
        log.info("경기 삭제 요청: {}", gameId);
        
        try {
            gameService.deleteGame(gameId);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            log.error("경기 삭제 실패: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }
}
