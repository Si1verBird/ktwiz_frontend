package com.kt.backendapp.service;

import com.kt.backendapp.dto.ChatResponse;
import com.kt.backendapp.entity.Chat;
import com.kt.backendapp.entity.User;
import com.kt.backendapp.enums.ChatRole;
import com.kt.backendapp.repository.ChatRepository;
import com.kt.backendapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class ChatService {
    
    private final ChatRepository chatRepository;
    private final UserRepository userRepository;
    
    /**
     * 새로운 세션 ID 생성 (24시간 단위)
     */
    public UUID generateSessionId() {
        return UUID.randomUUID();
    }
    
    /**
     * 사용자 메시지 저장
     */
    public ChatResponse saveUserMessage(UUID sessionId, UUID userId, String message) {
        log.info("사용자 메시지 저장: sessionId={}, userId={}", sessionId, userId);
        
        User user = null;
        if (userId != null) {
            user = userRepository.findById(userId).orElse(null);
        }
        
        Chat chat = new Chat();
        chat.setSessionId(sessionId);
        chat.setUser(user);
        chat.setRole(ChatRole.USER);
        chat.setMessage(message);
        chat.setCreatedAt(LocalDateTime.now());
        
        Chat saved = chatRepository.save(chat);
        return convertToChatResponse(saved);
    }
    
    /**
     * 봇 응답 저장
     */
    public ChatResponse saveBotMessage(UUID sessionId, String message) {
        log.info("봇 응답 저장: sessionId={}", sessionId);
        
        Chat chat = new Chat();
        chat.setSessionId(sessionId);
        chat.setUser(null);  // 봇은 user가 null
        chat.setRole(ChatRole.ASSISTANT);
        chat.setMessage(message);
        chat.setCreatedAt(LocalDateTime.now());
        
        Chat saved = chatRepository.save(chat);
        return convertToChatResponse(saved);
    }
    
    /**
     * 관리자 응답 저장
     */
    public ChatResponse saveAdminMessage(UUID sessionId, UUID adminId, String message) {
        log.info("관리자 응답 저장: sessionId={}, adminId={}", sessionId, adminId);
        
        User admin = userRepository.findById(adminId).orElse(null);
        
        Chat chat = new Chat();
        chat.setSessionId(sessionId);
        chat.setUser(admin);
        chat.setRole(ChatRole.ADMIN);
        chat.setMessage(message);
        chat.setCreatedAt(LocalDateTime.now());
        
        Chat saved = chatRepository.save(chat);
        return convertToChatResponse(saved);
    }
    
    /**
     * 세션별 채팅 내역 조회 (DTO 반환)
     */
    @Transactional(readOnly = true)
    public List<ChatResponse> getChatHistory(UUID sessionId) {
        log.info("채팅 내역 조회: sessionId={}", sessionId);
        List<Chat> chats = chatRepository.findBySessionIdOrderByCreatedAtAsc(sessionId);
        
        // 각 Chat 엔티티를 DTO로 변환하여 Hibernate 프록시 문제 해결
        List<ChatResponse> responses = new ArrayList<>();
        for (Chat chat : chats) {
            ChatResponse.UserDto userDto = null;
            
            try {
                if (chat.getUser() != null) {
                    UUID userId = chat.getUser().getId();
                    if (userId != null) {
                        // User 정보가 있는 경우에만 처리
                        User user = userRepository.findById(userId).orElse(null);
                        if (user != null) {
                            userDto = ChatResponse.UserDto.builder()
                                    .id(user.getId())
                                    .email(user.getEmail())
                                    .nickname(user.getNickname())
                                    .isAdmin(user.isAdmin())
                                    .build();
                        }
                    }
                }
            } catch (Exception e) {
                log.warn("User 정보 로드 실패 for chat {}: {}", chat.getId(), e.getMessage());
                // userDto는 null로 유지
            }
            
            ChatResponse response = ChatResponse.builder()
                    .id(chat.getId())
                    .sessionId(chat.getSessionId())
                    .user(userDto)
                    .role(chat.getRole())
                    .message(chat.getMessage())
                    .createdAt(chat.getCreatedAt())
                    .build();
            
            responses.add(response);
        }
        
        return responses;
    }
    
    /**
     * 24시간 지난 채팅 정리 (스케줄러에서 호출)
     */
    public void cleanupOldChats() {
        log.info("오래된 채팅 정리 시작");
        
        LocalDateTime cutoffTime = LocalDateTime.now().minusHours(24);
        List<Chat> oldChats = chatRepository.findByCreatedAtBefore(cutoffTime);
        
        if (!oldChats.isEmpty()) {
            chatRepository.deleteAll(oldChats);
            log.info("{}개의 오래된 채팅 삭제됨", oldChats.size());
        }
    }
    
    /**
     * 간단한 봇 응답 생성 (관리자가 응답하기 전까지 기본 응답)
     */
    public String generateBotResponse(String userMessage) {
        return "문의해주셔서 감사합니다. 관리자가 확인 후 답변드리겠습니다. 잠시만 기다려주세요.";
    }
    
    /**
     * Chat 엔티티를 ChatResponse DTO로 변환
     */
    private ChatResponse convertToChatResponse(Chat chat) {
        ChatResponse.UserDto userDto = null;
        if (chat.getUser() != null) {
            // Hibernate 프록시 문제를 피하기 위해 필요한 필드만 직접 추출
            User user = chat.getUser();
            userDto = ChatResponse.UserDto.builder()
                    .id(user.getId())
                    .email(user.getEmail())
                    .nickname(user.getNickname())
                    .isAdmin(user.isAdmin())
                    .build();
        }
        
        return ChatResponse.builder()
                .id(chat.getId())
                .sessionId(chat.getSessionId())
                .user(userDto)
                .role(chat.getRole())
                .message(chat.getMessage())
                .createdAt(chat.getCreatedAt())
                .build();
    }
}
