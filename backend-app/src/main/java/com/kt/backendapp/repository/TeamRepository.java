package com.kt.backendapp.repository;

import com.kt.backendapp.entity.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface TeamRepository extends JpaRepository<Team, UUID> {
    Optional<Team> findByName(String name);
    Optional<Team> findByShortName(String shortName);
}
