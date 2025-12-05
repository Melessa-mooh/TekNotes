package com.appdevg4.bcd.teknotes.dto;

import com.appdevg4.bcd.teknotes.entity.GroupChat;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter @Setter
public class GroupChatDto {
    private Integer groupId;
    private String chatName;
    private String description;
    private LocalDateTime createdAt;
    private Boolean isVerified;
    private Integer createdByUserId;
    private String createdByName;
    private Integer memberCount;
    private Integer messageCount;

    public static GroupChatDto from(GroupChat groupChat) {
        GroupChatDto dto = new GroupChatDto();
        dto.groupId = groupChat.getGroupId();
        dto.chatName = groupChat.getChatName();
        dto.description = groupChat.getDescription();
        dto.createdAt = groupChat.getCreatedAt();
        dto.isVerified = groupChat.getIsVerified();
        dto.createdByUserId = groupChat.getCreatedBy().getUserId();
        dto.createdByName = groupChat.getCreatedBy().getFirstName() + " " + groupChat.getCreatedBy().getLastName();
        dto.memberCount = groupChat.getMembers() != null ? groupChat.getMembers().size() : 0;
        dto.messageCount = groupChat.getMessages() != null ? groupChat.getMessages().size() : 0;
        return dto;
    }
}

