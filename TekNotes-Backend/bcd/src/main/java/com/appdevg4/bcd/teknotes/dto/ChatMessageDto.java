package com.appdevg4.bcd.teknotes.dto;

import com.appdevg4.bcd.teknotes.entity.ChatMessage;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter @Setter
public class ChatMessageDto {
    private Integer messageId;
    private Integer userId;
    private String userName;
    private Integer groupId;
    private String content;
    private LocalDateTime timestamp;

    public static ChatMessageDto from(ChatMessage message) {
        ChatMessageDto dto = new ChatMessageDto();
        dto.messageId = message.getMessageId();
        dto.userId = message.getUser().getUserId();
        dto.userName = message.getUser().getFirstName() + " " + message.getUser().getLastName();
        dto.groupId = message.getGroupChat().getGroupId();
        dto.content = message.getContent();
        dto.timestamp = message.getTimestamp();
        return dto;
    }
}

