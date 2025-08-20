package com.kt.backendapp.service;

import com.kt.backendapp.dto.LoginResponse;
import com.kt.backendapp.entity.User;
import com.kt.backendapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;

    @Transactional
    public LoginResponse login(String email, String password) {
        log.info("로그인 시도: {}", email);
        
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> {
                    log.error("사용자를 찾을 수 없습니다: {}", email);
                    return new RuntimeException("사용자를 찾을 수 없습니다.");
                });

        log.info("DB에서 조회된 사용자: email={}, password={}", user.getEmail(), user.getPassword());
        log.info("입력된 비밀번호: {}", password);

        // 평문 비밀번호 비교
        if (!user.getPassword().equals(password)) {
            log.error("비밀번호 불일치: DB={}, 입력={}", user.getPassword(), password);
            throw new RuntimeException("비밀번호가 일치하지 않습니다.");
        }

        // 마지막 로그인 시간 업데이트
        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);

        log.info("로그인 성공: {} (관리자: {})", email, user.isAdmin());

        return LoginResponse.builder()
                .userId(user.getId())
                .email(user.getEmail())
                .nickname(user.getNickname())
                .isAdmin(user.isAdmin())
                .message("로그인 성공")
                .build();
    }
}
