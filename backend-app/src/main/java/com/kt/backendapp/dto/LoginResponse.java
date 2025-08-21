package com.kt.backendapp.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {
    @JsonProperty("id")
    private UUID userId;
    private String email;
    private String nickname;
    
    @JsonProperty("is_admin")
    private boolean isAdmin;
    
    private String message;
}
