package com.appdevg4.bcd.teknotes.service;

import com.appdevg4.bcd.teknotes.entity.GroupChat;
import com.appdevg4.bcd.teknotes.entity.User;
import com.appdevg4.bcd.teknotes.entity.UserChat;
import com.appdevg4.bcd.teknotes.repository.GroupChatRepository;
import com.appdevg4.bcd.teknotes.repository.UserChatRepository;
import com.appdevg4.bcd.teknotes.repository.UserRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class GroupChatService {

    private final GroupChatRepository groupChatRepo;
    private final UserRepository userRepo;
    private final UserChatRepository userChatRepo;

    public GroupChatService(GroupChatRepository groupChatRepo, 
                           UserRepository userRepo,
                           UserChatRepository userChatRepo) {
        this.groupChatRepo = groupChatRepo;
        this.userRepo = userRepo;
        this.userChatRepo = userChatRepo;
    }

    public GroupChat createGroupChat(String chatName, String description, Integer createdByUserId, Boolean isVerified, String password) {
        User creator = userRepo.findById(createdByUserId)
                .orElseThrow(() -> new RuntimeException("User not found: " + createdByUserId));

        GroupChat groupChat = new GroupChat();
        groupChat.setChatName(chatName);
        groupChat.setDescription(description);
        groupChat.setCreatedBy(creator);
        groupChat.setIsVerified(isVerified != null ? isVerified : false);
        groupChat.setPassword(password);
        
        GroupChat saved = groupChatRepo.save(groupChat);
        
        // Automatically add creator as a member (no password needed for creator)
        User creatorUser = userRepo.findById(createdByUserId)
                .orElseThrow(() -> new RuntimeException("User not found: " + createdByUserId));
        UserChat userChat = new UserChat();
        userChat.setUser(creatorUser);
        userChat.setGroupChat(saved);
        userChatRepo.save(userChat);
        
        return saved;
    }

    public List<GroupChat> getAllGroups() {
        return groupChatRepo.findAllOrderByCreatedAtDesc();
    }

    public List<GroupChat> getVerifiedGroups() {
        return groupChatRepo.findAllVerified();
    }

    public List<GroupChat> getUserGroups(Integer userId) {
        return userChatRepo.findByUserId(userId).stream()
                .map(UserChat::getGroupChat)
                .toList();
    }

    public List<GroupChat> getGroupsCreatedByUser(Integer userId) {
        return groupChatRepo.findByCreatedByUserId(userId);
    }

    public GroupChat getGroupById(Integer groupId) {
        return groupChatRepo.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found: " + groupId));
    }

    public UserChat joinGroup(Integer userId, Integer groupId, String password) {
        // Check if already a member
        Optional<UserChat> existing = userChatRepo.findByUserIdAndGroupId(userId, groupId);
        if (existing.isPresent()) {
            return existing.get();
        }

        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));
        GroupChat groupChat = getGroupById(groupId);

        // Verify password if group has one
        if (groupChat.getPassword() != null && !groupChat.getPassword().isEmpty()) {
            if (password == null || !groupChat.getPassword().equals(password)) {
                throw new RuntimeException("Invalid password for group");
            }
        }

        UserChat userChat = new UserChat();
        userChat.setUser(user);
        userChat.setGroupChat(groupChat);
        
        return userChatRepo.save(userChat);
    }

    public void leaveGroup(Integer userId, Integer groupId) {
        Optional<UserChat> userChat = userChatRepo.findByUserIdAndGroupId(userId, groupId);
        userChat.ifPresent(userChatRepo::delete);
    }

    public void verifyGroup(Integer groupId) {
        GroupChat groupChat = getGroupById(groupId);
        groupChat.setIsVerified(true);
        groupChatRepo.save(groupChat);
    }

    public void deleteGroup(Integer groupId) {
        groupChatRepo.deleteById(groupId);
    }
}

