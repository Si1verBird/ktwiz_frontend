package com.kt.backendapp.repository;

import com.kt.backendapp.entity.Game;
import com.kt.backendapp.entity.Team;
import com.kt.backendapp.enums.GameStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface GameRepository extends JpaRepository<Game, UUID> {
    
    List<Game> findByStatusOrderByDateTimeAsc(GameStatus status);
    
    List<Game> findByDateTimeBetweenOrderByDateTimeAsc(LocalDateTime start, LocalDateTime end);
    
    @Query("SELECT g FROM Game g WHERE (g.homeTeam = :team OR g.awayTeam = :team) AND g.status = :status")
    List<Game> findByTeamAndStatus(@Param("team") Team team, @Param("status") GameStatus status);
    
    @Query("SELECT g FROM Game g WHERE (g.homeTeam = :team OR g.awayTeam = :team)")
    List<Game> findByTeam(@Param("team") Team team);
    
    @Query("SELECT COUNT(g) FROM Game g WHERE (g.homeTeam = :team OR g.awayTeam = :team) AND g.status = :status")
    Long countCompletedGamesByTeam(@Param("team") Team team, @Param("status") GameStatus status);
    
    @Query("SELECT COUNT(g) FROM Game g WHERE ((g.homeTeam = :team AND g.homeScore > g.awayScore) OR (g.awayTeam = :team AND g.awayScore > g.homeScore)) AND g.status = :status")
    Long countWinsByTeam(@Param("team") Team team, @Param("status") GameStatus status);
    
    @Query("SELECT COUNT(g) FROM Game g WHERE ((g.homeTeam = :team AND g.homeScore < g.awayScore) OR (g.awayTeam = :team AND g.awayScore < g.homeScore)) AND g.status = :status")
    Long countLossesByTeam(@Param("team") Team team, @Param("status") GameStatus status);
    
    // 가장 가까운 경기 조회를 위한 메서드들
    List<Game> findByDateTimeAfterOrderByDateTimeAsc(LocalDateTime dateTime);
    
    List<Game> findTop1ByOrderByDateTimeDesc();
    
    // KT Wiz의 최근 종료된 경기 조회
    @Query("SELECT g FROM Game g JOIN FETCH g.homeTeam ht JOIN FETCH ht.venue JOIN FETCH g.awayTeam WHERE (g.homeTeam.id = :teamId OR g.awayTeam.id = :teamId) AND g.status = :status ORDER BY g.dateTime DESC")
    List<Game> findByTeamIdAndStatusOrderByDateTimeDesc(@Param("teamId") UUID teamId, @Param("status") GameStatus status);
    
    // 팀과 상태로 경기 필터링 (간단한 버전) - JOIN FETCH 포함
    @Query("SELECT g FROM Game g JOIN FETCH g.homeTeam ht JOIN FETCH ht.venue JOIN FETCH g.awayTeam WHERE (g.homeTeam.id IN :homeTeamIds OR g.awayTeam.id IN :awayTeamIds) AND g.status IN :statuses ORDER BY g.dateTime ASC")
    List<Game> findByHomeTeamIdInOrAwayTeamIdInAndStatusInOrderByDateTimeAsc(
        @Param("homeTeamIds") List<UUID> homeTeamIds, 
        @Param("awayTeamIds") List<UUID> awayTeamIds, 
        @Param("statuses") List<GameStatus> statuses
    );
    
    // 상태로 경기 조회 - JOIN FETCH 포함
    @Query("SELECT g FROM Game g JOIN FETCH g.homeTeam ht JOIN FETCH ht.venue JOIN FETCH g.awayTeam WHERE g.status IN :statuses ORDER BY g.dateTime ASC")
    List<Game> findByStatusInOrderByDateTimeAsc(@Param("statuses") List<GameStatus> statuses);
    
    // 전체 경기 조회 (findAll 오버라이드) - JOIN FETCH 포함
    @Query("SELECT g FROM Game g JOIN FETCH g.homeTeam ht JOIN FETCH ht.venue JOIN FETCH g.awayTeam ORDER BY g.dateTime ASC")
    List<Game> findAll();
}
