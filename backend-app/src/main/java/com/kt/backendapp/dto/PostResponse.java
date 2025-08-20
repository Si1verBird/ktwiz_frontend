package com.kt.backendapp.dto;

import com.kt.backendapp.enums.PostCategory;
import com.kt.backendapp.enums.PostStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostResponse {
    private UUID id;
    private PostCategory category;
    private String title;
    private String body;
    private String thumbnail;
    private String images;
    private String videoUrl;
    private PostStatus status;
    private String slug;
    private AuthorDto author;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AuthorDto {
        private UUID id;
        private String nickname;
        private boolean isAdmin;
    }
}
