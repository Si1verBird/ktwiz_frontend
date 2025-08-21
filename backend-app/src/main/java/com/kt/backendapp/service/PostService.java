package com.kt.backendapp.service;

import com.kt.backendapp.dto.PostResponse;
import com.kt.backendapp.entity.Post;
import com.kt.backendapp.enums.PostStatus;
import com.kt.backendapp.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PostService {

    private final PostRepository postRepository;

    public List<PostResponse> getRecentAdminPosts(int limit) {
        log.debug("최근 관리자 게시물 조회 (limit: {})", limit);
        
        List<Post> posts = postRepository.findRecentAdminPosts(
                PostStatus.published, 
                PageRequest.of(0, limit)
        );
        
        log.info("최근 관리자 게시물 {} 개 조회", posts.size());
        
        return posts.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<PostResponse> getRecentPosts(int limit) {
        log.debug("최근 게시물 조회 (limit: {})", limit);
        
        List<Post> posts = postRepository.findRecentPosts(
                PostStatus.published, 
                PageRequest.of(0, limit)
        );
        
        log.info("최근 게시물 {} 개 조회", posts.size());
        
        return posts.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<PostResponse> getAllPosts() {
        log.debug("모든 게시물 조회");
        
        List<Post> posts = postRepository.findAllByOrderByCreatedAtDesc();
        
        log.info("총 {} 개 게시물 조회", posts.size());
        
        return posts.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    private PostResponse convertToResponse(Post post) {
        return PostResponse.builder()
                .id(post.getId())
                .category(post.getCategory())
                .title(post.getTitle())
                .body(post.getBody())
                .thumbnail(post.getThumbnail())
                .images(post.getImages())
                .videoUrl(post.getVideoUrl())
                .status(post.getStatus())
                .slug(post.getSlug())
                .author(PostResponse.AuthorDto.builder()
                        .id(post.getAuthor().getId())
                        .nickname(post.getAuthor().getNickname())
                        .isAdmin(post.getAuthor().isAdmin())
                        .build())
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .build();
    }
}