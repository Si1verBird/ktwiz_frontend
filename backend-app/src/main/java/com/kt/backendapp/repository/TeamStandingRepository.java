package com.kt.backendapp.repository;

import com.kt.backendapp.entity.TeamStanding;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TeamStandingRepository extends JpaRepository<TeamStanding, UUID> {
    
    @Query("SELECT ts FROM TeamStanding ts JOIN FETCH ts.team ORDER BY ts.winRate DESC, ts.wins DESC")
    List<TeamStanding> findAllOrderByRanking();
    
    @Query("SELECT ts FROM TeamStanding ts JOIN FETCH ts.team WHERE ts.team.name = :teamName")
    TeamStanding findByTeamName(String teamName);
}
