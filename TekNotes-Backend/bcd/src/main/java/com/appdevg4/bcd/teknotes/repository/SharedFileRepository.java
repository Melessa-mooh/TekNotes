package com.appdevg4.bcd.teknotes.repository;

import com.appdevg4.bcd.teknotes.entity.SharedFile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface SharedFileRepository extends JpaRepository<SharedFile, Integer> {
    
    @Query("SELECT sf FROM SharedFile sf WHERE sf.groupChat.groupId = :groupId ORDER BY sf.uploadTime DESC")
    List<SharedFile> findByGroupIdOrderByUploadTimeDesc(@Param("groupId") Integer groupId);
}

