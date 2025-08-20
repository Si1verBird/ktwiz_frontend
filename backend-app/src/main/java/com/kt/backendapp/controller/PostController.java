package com.kt.backendapp.controller;

import com.kt.backendapp.dto.PostResponse;
import com.kt.backendapp.service.PostService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @GetMapping("/admin-recent")
    public ResponseEntity<List<PostResponse>> getRecentAdminPosts(@RequestParam(defaultValue = "3") int limit) {
        log.info("최근 관리자 게시물 조회 요청 (limit: {})", limit);
        
        List<PostResponse> posts = postService.getRecentAdminPosts(limit);
        log.info("최근 관리자 게시물 {} 개 조회 완료", posts.size());
        
        return ResponseEntity.ok(posts);
    }

    @GetMapping
    public ResponseEntity<List<PostResponse>> getAllPosts() {
        log.info("모든 게시물 조회 요청");
        
        List<PostResponse> posts = postService.getAllPosts();
        log.info("총 {} 개 게시물 조회 완료", posts.size());
        
        return ResponseEntity.ok(posts);
    }
}
