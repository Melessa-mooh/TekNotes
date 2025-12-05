package com.appdevg4.bcd.teknotes.repository;

import com.appdevg4.bcd.teknotes.entity.UserChat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface UserChatRepository extends JpaRepository<UserChat, Integer> {
    
    @Query("SELECT uc FROM UserChat uc WHERE uc.user.userId = :userId")
    List<UserChat> findByUserId(@Param("userId") Integer userId);
    
    @Query("SELECT uc FROM UserChat uc WHERE uc.groupChat.groupId = :groupId")
    List<UserChat> findByGroupId(@Param("groupId") Integer groupId);
    
    @Query("SELECT uc FROM UserChat uc WHERE uc.user.userId = :userId AND uc.groupChat.groupId = :groupId")
    Optional<UserChat> findByUserIdAndGroupId(@Param("userId") Integer userId, @Param("groupId") Integer groupId);
}

