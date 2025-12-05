package com.appdevg4.bcd.teknotes.controller;

import com.appdevg4.bcd.teknotes.dto.GroupChatDto;
import com.appdevg4.bcd.teknotes.entity.GroupChat;
import com.appdevg4.bcd.teknotes.service.GroupChatService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/groups")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class GroupChatController {

    private final GroupChatService service;

    public GroupChatController(GroupChatService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<GroupChatDto> createGroup(@RequestBody CreateGroupRequest request) {
        try {
            GroupChat groupChat = service.createGroupChat(
                    request.getChatName(),
                    request.getDescription(),
                    request.getCreatedByUserId(),
                    request.getIsVerified(),
                    request.getPassword()
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(GroupChatDto.from(groupChat));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @GetMapping
    public ResponseEntity<List<GroupChatDto>> getAllGroups() {
        try {
            List<GroupChatDto> groups = service.getAllGroups().stream()
                    .map(GroupChatDto::from)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(groups);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/verified")
    public ResponseEntity<List<GroupChatDto>> getVerifiedGroups() {
        try {
            List<GroupChatDto> groups = service.getVerifiedGroups().stream()
                    .map(GroupChatDto::from)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(groups);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<GroupChatDto>> getUserGroups(@PathVariable Integer userId) {
        try {
            List<GroupChatDto> groups = service.getUserGroups(userId).stream()
                    .map(GroupChatDto::from)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(groups);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/created/{userId}")
    public ResponseEntity<List<GroupChatDto>> getGroupsCreatedByUser(@PathVariable Integer userId) {
        try {
            List<GroupChatDto> groups = service.getGroupsCreatedByUser(userId).stream()
                    .map(GroupChatDto::from)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(groups);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{groupId}")
    public ResponseEntity<GroupChatDto> getGroupById(@PathVariable Integer groupId) {
        try {
            GroupChatDto group = GroupChatDto.from(service.getGroupById(groupId));
            return ResponseEntity.ok(group);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PostMapping("/{groupId}/join/{userId}")
    public ResponseEntity<String> joinGroup(@PathVariable Integer groupId, @PathVariable Integer userId, @RequestBody(required = false) JoinGroupRequest request) {
        try {
            String password = request != null ? request.getPassword() : null;
            service.joinGroup(userId, groupId, password);
            return ResponseEntity.ok("Successfully joined group");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @DeleteMapping("/{groupId}/leave/{userId}")
    public ResponseEntity<String> leaveGroup(@PathVariable Integer groupId, @PathVariable Integer userId) {
        try {
            service.leaveGroup(userId, groupId);
            return ResponseEntity.ok("Successfully left group");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/{groupId}/verify")
    public ResponseEntity<String> verifyGroup(@PathVariable Integer groupId) {
        try {
            service.verifyGroup(groupId);
            return ResponseEntity.ok("Group verified");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @DeleteMapping("/{groupId}")
    public ResponseEntity<Void> deleteGroup(@PathVariable Integer groupId) {
        try {
            service.deleteGroup(groupId);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    // Inner classes for requests
    public static class CreateGroupRequest {
        private String chatName;
        private String description;
        private Integer createdByUserId;
        private Boolean isVerified;
        private String password;

        public String getChatName() { return chatName; }
        public void setChatName(String chatName) { this.chatName = chatName; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public Integer getCreatedByUserId() { return createdByUserId; }
        public void setCreatedByUserId(Integer createdByUserId) { this.createdByUserId = createdByUserId; }
        public Boolean getIsVerified() { return isVerified; }
        public void setIsVerified(Boolean isVerified) { this.isVerified = isVerified; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class JoinGroupRequest {
        private String password;

        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }
}

