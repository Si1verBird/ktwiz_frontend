package com.kt.backendapp.controller;

import com.kt.backendapp.dto.ChatResponse;
import com.kt.backendapp.service.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/chats")
@RequiredArgsConstructor
public class ChatController {
    
    private final ChatService chatService;
    
    /**
     * 새로운 채팅 세션 생성
     */
    @PostMapping("/session")
    public ResponseEntity<Map<String, UUID>> createSession() {
        log.info("새로운 채팅 세션 생성 요청");
        
        UUID sessionId = chatService.generateSessionId();
        return ResponseEntity.ok(Map.of("sessionId", sessionId));
    }
    
    /**
     * 세션별 채팅 내역 조회
     */
    @GetMapping("/session/{sessionId}")
    public ResponseEntity<List<ChatResponse>> getChatHistory(@PathVariable UUID sessionId) {
        log.info("채팅 내역 조회 요청: sessionId={}", sessionId);
        
        List<ChatResponse> chatHistory = chatService.getChatHistory(sessionId);
        return ResponseEntity.ok(chatHistory);
    }
    
    /**
     * 메시지 전송 (사용자 → 봇)
     */
    @PostMapping("/message")
    public ResponseEntity<ChatResponse> sendMessage(@RequestBody MessageRequest request) {
        log.info("메시지 전송 요청: sessionId={}", request.getSessionId());
        
        try {
            // 사용자 메시지 저장
            ChatResponse userMessage = chatService.saveUserMessage(
                request.getSessionId(), 
                request.getUserId(), 
                request.getMessage()
            );
            
            // 봇 응답 생성 및 저장
            String botResponse = chatService.generateBotResponse(request.getMessage());
            ChatResponse botMessage = chatService.saveBotMessage(request.getSessionId(), botResponse);
            
            // 사용자 메시지 반환 (프론트에서 봇 응답은 별도 조회)
            return ResponseEntity.ok(userMessage);
            
        } catch (Exception e) {
            log.error("메시지 전송 중 오류 발생", e);
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * 관리자 메시지 전송
     */
    @PostMapping("/admin-message")
    public ResponseEntity<ChatResponse> sendAdminMessage(@RequestBody AdminMessageRequest request) {
        log.info("관리자 메시지 전송 요청: sessionId={}, adminId={}", request.getSessionId(), request.getAdminId());
        
        try {
            // 관리자 메시지 저장
            ChatResponse adminMessage = chatService.saveAdminMessage(
                request.getSessionId(), 
                request.getAdminId(), 
                request.getMessage()
            );
            
            return ResponseEntity.ok(adminMessage);
            
        } catch (Exception e) {
            log.error("관리자 메시지 전송 중 오류 발생", e);
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * 메시지 요청 DTO
     */
    public static class MessageRequest {
        private UUID sessionId;
        private UUID userId;  // null 가능 (비로그인 사용자)
        private String message;
        
        public UUID getSessionId() { return sessionId; }
        public void setSessionId(UUID sessionId) { this.sessionId = sessionId; }
        
        public UUID getUserId() { return userId; }
        public void setUserId(UUID userId) { this.userId = userId; }
        
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }
    
    /**
     * 관리자 메시지 요청 DTO
     */
    public static class AdminMessageRequest {
        private UUID sessionId;
        private UUID adminId;  // 관리자 사용자 ID
        private String message;
        
        public UUID getSessionId() { return sessionId; }
        public void setSessionId(UUID sessionId) { this.sessionId = sessionId; }
        
        public UUID getAdminId() { return adminId; }
        public void setAdminId(UUID adminId) { this.adminId = adminId; }
        
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }
}
