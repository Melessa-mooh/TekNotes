package com.appdevg4.bcd.teknotes.dto;

import com.appdevg4.bcd.teknotes.entity.UserChat;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter @Setter
public class UserChatDto {
    private Integer id;
    private Integer userId;
    private String userName;
    private Integer groupId;
    private String groupName;
    private LocalDateTime joinedAt;

    public static UserChatDto from(UserChat userChat) {
        UserChatDto dto = new UserChatDto();
        dto.id = userChat.getId();
        dto.userId = userChat.getUser().getUserId();
        dto.userName = userChat.getUser().getFirstName() + " " + userChat.getUser().getLastName();
        dto.groupId = userChat.getGroupChat().getGroupId();
        dto.groupName = userChat.getGroupChat().getChatName();
        dto.joinedAt = userChat.getJoinedAt();
        return dto;
    }
}

