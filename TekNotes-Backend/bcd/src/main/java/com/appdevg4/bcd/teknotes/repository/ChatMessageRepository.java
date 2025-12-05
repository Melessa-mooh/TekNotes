package com.appdevg4.bcd.teknotes.repository;

import com.appdevg4.bcd.teknotes.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Integer> {
    
    @Query("SELECT cm FROM ChatMessage cm WHERE cm.groupChat.groupId = :groupId ORDER BY cm.timestamp ASC")
    List<ChatMessage> findByGroupIdOrderByTimestamp(@Param("groupId") Integer groupId);
    
    @Query("SELECT cm FROM ChatMessage cm WHERE cm.groupChat.groupId = :groupId ORDER BY cm.timestamp DESC")
    List<ChatMessage> findByGroupIdOrderByTimestampDesc(@Param("groupId") Integer groupId);
}

