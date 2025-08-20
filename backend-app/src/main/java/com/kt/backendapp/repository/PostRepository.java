package com.kt.backendapp.repository;

import com.kt.backendapp.entity.Post;
import com.kt.backendapp.enums.PostStatus;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PostRepository extends JpaRepository<Post, UUID> {
    
    @Query("SELECT p FROM Post p JOIN FETCH p.author " +
           "WHERE p.author.isAdmin = true AND p.status = :status AND p.deleted = false " +
           "ORDER BY p.createdAt DESC")
    List<Post> findRecentAdminPosts(PostStatus status, Pageable pageable);
    
    @Query("SELECT p FROM Post p JOIN FETCH p.author " +
           "WHERE p.deleted = false " +
           "ORDER BY p.createdAt DESC")
    List<Post> findAllByOrderByCreatedAtDesc();
}
