package com.kt.backendapp.repository;

import com.kt.backendapp.entity.Chat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface ChatRepository extends JpaRepository<Chat, UUID> {
    
    /**
     * 세션별 채팅 내역 조회 (생성일시 순)
     */
    @Query("SELECT c FROM Chat c LEFT JOIN FETCH c.user WHERE c.sessionId = :sessionId ORDER BY c.createdAt ASC")
    List<Chat> findBySessionIdOrderByCreatedAtAsc(@Param("sessionId") UUID sessionId);
    
    /**
     * 특정 시간 이전 채팅 삭제를 위한 조회
     */
    @Query("SELECT c FROM Chat c WHERE c.createdAt < :cutoffTime")
    List<Chat> findByCreatedAtBefore(@Param("cutoffTime") LocalDateTime cutoffTime);
    
    /**
     * 세션별 채팅 수 조회
     */
    @Query("SELECT COUNT(c) FROM Chat c WHERE c.sessionId = :sessionId")
    Long countBySessionId(@Param("sessionId") UUID sessionId);
}
