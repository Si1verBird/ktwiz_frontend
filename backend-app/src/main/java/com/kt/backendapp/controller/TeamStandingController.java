package com.kt.backendapp.controller;

import com.kt.backendapp.dto.TeamStandingResponse;
import com.kt.backendapp.service.TeamStandingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/standings")
@RequiredArgsConstructor
@Slf4j
public class TeamStandingController {

    private final TeamStandingService teamStandingService;

    /**
     * 모든 팀 순위표 조회
     */
    @GetMapping
    public ResponseEntity<List<TeamStandingResponse>> getAllTeamStandings() {
        log.info("모든 팀 순위표 조회 요청");
        List<TeamStandingResponse> standings = teamStandingService.getAllTeamStandings();
        return ResponseEntity.ok(standings);
    }

    /**
     * 특정 팀 순위 정보 조회
     */
    @GetMapping("/team/{teamName}")
    public ResponseEntity<TeamStandingResponse> getTeamStandingByName(@PathVariable String teamName) {
        log.info("팀 순위 정보 조회 요청: {}", teamName);
        TeamStandingResponse standing = teamStandingService.getTeamStandingByName(teamName);
        
        if (standing == null) {
            return ResponseEntity.notFound().build();
        }
        
        return ResponseEntity.ok(standing);
    }

    /**
     * KT Wiz 팀 순위 정보 조회 (메인페이지용)
     */
    @GetMapping("/kt-wiz")
    public ResponseEntity<TeamStandingResponse> getKtWizStanding() {
        log.info("KT Wiz 팀 순위 정보 조회 요청 (메인페이지용)");
        TeamStandingResponse standing = teamStandingService.getTeamStandingByName("KT wiz");
        
        if (standing == null) {
            return ResponseEntity.notFound().build();
        }
        
        return ResponseEntity.ok(standing);
    }

    /**
     * 모든 팀 통계 수동 업데이트 (관리자용)
     */
    @PostMapping("/refresh")
    public ResponseEntity<String> refreshAllStandings() {
        log.info("모든 팀 통계 수동 업데이트 요청");
        
        try {
            teamStandingService.updateAllTeamStandings();
            return ResponseEntity.ok("모든 팀 통계가 성공적으로 업데이트되었습니다.");
        } catch (Exception e) {
            log.error("팀 통계 업데이트 실패: {}", e.getMessage());
            return ResponseEntity.internalServerError().body("팀 통계 업데이트 중 오류가 발생했습니다.");
        }
    }

    /**
     * 팀 순위 테이블 초기화 (테스트용)
     */
    @PostMapping("/initialize")
    public ResponseEntity<String> initializeStandings() {
        log.info("팀 순위 테이블 초기화 요청");
        
        try {
            teamStandingService.initializeTeamStandings();
            return ResponseEntity.ok("팀 순위 테이블이 성공적으로 초기화되었습니다.");
        } catch (Exception e) {
            log.error("팀 순위 테이블 초기화 실패: {}", e.getMessage());
            return ResponseEntity.internalServerError().body("팀 순위 테이블 초기화 중 오류가 발생했습니다.");
        }
    }
}
