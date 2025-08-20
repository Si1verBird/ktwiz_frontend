package com.kt.backendapp.controller;

import com.kt.backendapp.dto.LoginRequest;
import com.kt.backendapp.dto.LoginResponse;
import com.kt.backendapp.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        log.info("로그인 시도: {}", request.getEmail());
        
        try {
            LoginResponse response = userService.login(request.getEmail(), request.getPassword());
            log.info("로그인 성공: {} (관리자: {})", request.getEmail(), response.isAdmin());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("로그인 실패: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
}
