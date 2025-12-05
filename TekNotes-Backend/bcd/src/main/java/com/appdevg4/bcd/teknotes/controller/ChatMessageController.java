package com.appdevg4.bcd.teknotes.controller;

import com.appdevg4.bcd.teknotes.dto.ChatMessageDto;
import com.appdevg4.bcd.teknotes.entity.ChatMessage;
import com.appdevg4.bcd.teknotes.service.ChatMessageService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/chat-messages")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class ChatMessageController {

    private final ChatMessageService service;

    public ChatMessageController(ChatMessageService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<ChatMessageDto> sendMessage(@RequestBody SendMessageRequest request) {
        try {
            ChatMessage message = service.sendMessage(
                    request.getUserId(),
                    request.getGroupId(),
                    request.getContent()
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(ChatMessageDto.from(message));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @GetMapping("/group/{groupId}")
    public ResponseEntity<List<ChatMessageDto>> getMessagesByGroup(@PathVariable Integer groupId) {
        try {
            List<ChatMessageDto> messages = service.getMessagesByGroup(groupId).stream()
                    .map(ChatMessageDto::from)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(messages);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{messageId}")
    public ResponseEntity<ChatMessageDto> editMessage(@PathVariable Integer messageId, @RequestBody EditMessageRequest request) {
        try {
            ChatMessage message = service.editMessage(messageId, request.getContent());
            return ResponseEntity.ok(ChatMessageDto.from(message));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @DeleteMapping("/{messageId}")
    public ResponseEntity<Void> deleteMessage(@PathVariable Integer messageId) {
        try {
            service.deleteMessage(messageId);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    // Inner classes for requests
    public static class SendMessageRequest {
        private Integer userId;
        private Integer groupId;
        private String content;

        public Integer getUserId() { return userId; }
        public void setUserId(Integer userId) { this.userId = userId; }
        public Integer getGroupId() { return groupId; }
        public void setGroupId(Integer groupId) { this.groupId = groupId; }
        public String getContent() { return content; }
        public void setContent(String content) { this.content = content; }
    }

    public static class EditMessageRequest {
        private String content;

        public String getContent() { return content; }
        public void setContent(String content) { this.content = content; }
    }
}

