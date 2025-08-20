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
    
    @Query("SELECT COUNT(g) FROM Game g WHERE (g.homeTeam = :team OR g.awayTeam = :team) AND g.status = 'ended'")
    Long countCompletedGamesByTeam(@Param("team") Team team);
    
    @Query("SELECT COUNT(g) FROM Game g WHERE ((g.homeTeam = :team AND g.homeScore > g.awayScore) OR (g.awayTeam = :team AND g.awayScore > g.homeScore)) AND g.status = 'ended'")
    Long countWinsByTeam(@Param("team") Team team);
    
    @Query("SELECT COUNT(g) FROM Game g WHERE ((g.homeTeam = :team AND g.homeScore < g.awayScore) OR (g.awayTeam = :team AND g.awayScore < g.homeScore)) AND g.status = 'ended'")
    Long countLossesByTeam(@Param("team") Team team);
    
    // 가장 가까운 경기 조회를 위한 메서드들
    List<Game> findByDateTimeAfterOrderByDateTimeAsc(LocalDateTime dateTime);
    
    List<Game> findTop1ByOrderByDateTimeDesc();
}
