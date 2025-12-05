package com.appdevg4.bcd.teknotes.repository;

import com.appdevg4.bcd.teknotes.entity.GroupChat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface GroupChatRepository extends JpaRepository<GroupChat, Integer> {
    
    @Query("SELECT gc FROM GroupChat gc WHERE gc.isVerified = true ORDER BY gc.createdAt DESC")
    List<GroupChat> findAllVerified();
    
    @Query("SELECT gc FROM GroupChat gc ORDER BY gc.createdAt DESC")
    List<GroupChat> findAllOrderByCreatedAtDesc();
    
    @Query("SELECT gc FROM GroupChat gc WHERE gc.createdBy.userId = :userId ORDER BY gc.createdAt DESC")
    List<GroupChat> findByCreatedByUserId(@Param("userId") Integer userId);
}

