package com.kt.backendapp.repository;

import com.kt.backendapp.entity.Venue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface VenueRepository extends JpaRepository<Venue, UUID> {
    Optional<Venue> findByName(String name);
}
