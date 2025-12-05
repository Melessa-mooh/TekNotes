package com.appdevg4.bcd.teknotes.service;

import com.appdevg4.bcd.teknotes.entity.ChatMessage;
import com.appdevg4.bcd.teknotes.entity.GroupChat;
import com.appdevg4.bcd.teknotes.entity.User;
import com.appdevg4.bcd.teknotes.repository.ChatMessageRepository;
import com.appdevg4.bcd.teknotes.repository.GroupChatRepository;
import com.appdevg4.bcd.teknotes.repository.UserRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ChatMessageService {

    private final ChatMessageRepository messageRepo;
    private final UserRepository userRepo;
    private final GroupChatRepository groupChatRepo;

    public ChatMessageService(ChatMessageRepository messageRepo,
                             UserRepository userRepo,
                             GroupChatRepository groupChatRepo) {
        this.messageRepo = messageRepo;
        this.userRepo = userRepo;
        this.groupChatRepo = groupChatRepo;
    }

    public ChatMessage sendMessage(Integer userId, Integer groupId, String content) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));
        GroupChat groupChat = groupChatRepo.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found: " + groupId));

        ChatMessage message = new ChatMessage();
        message.setUser(user);
        message.setGroupChat(groupChat);
        message.setContent(content);
        
        return messageRepo.save(message);
    }

    public List<ChatMessage> getMessagesByGroup(Integer groupId) {
        return messageRepo.findByGroupIdOrderByTimestamp(groupId);
    }

    public void deleteMessage(Integer messageId) {
        messageRepo.deleteById(messageId);
    }

    public ChatMessage editMessage(Integer messageId, String newContent) {
        ChatMessage message = messageRepo.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found: " + messageId));
        message.setContent(newContent);
        return messageRepo.save(message);
    }
}

