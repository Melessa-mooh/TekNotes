package com.appdevg4.bcd.teknotes.repository;

import com.appdevg4.bcd.teknotes.entity.Resource;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ResourceRepository extends JpaRepository<Resource, Integer> {
    List<Resource> findByTagNameContainingIgnoreCase(String tagName);
    List<Resource> findByCourse_TeacherNameContainingIgnoreCase(String teacherName);

    // DASHBOARD: count how many notes the user has uploaded
    // ⚠️ If your field is "user" instead of "uploader", change r.uploader → r.user
    @Query("select count(r) from Resource r where r.uploader.userId = :userId")
    long countUploadedByUser(@Param("userId") Integer userId);

    // DASHBOARD: get the most recent uploads of this user
    @Query("select r from Resource r where r.uploader.userId = :userId order by r.createdAt desc")
    List<Resource> findRecentUploads(@Param("userId") Integer userId, Pageable pageable);

    // DASHBOARD: get ALL recent uploads from ALL users
    @Query("select r from Resource r order by r.createdAt desc")
    List<Resource> findAllRecentUploads(Pageable pageable);

    // MY MATERIALS: get ALL resources uploaded by a specific user
    @Query("select r from Resource r where r.uploader.userId = :userId order by r.createdAt desc")
    List<Resource> findByUploaderUserId(@Param("userId") Integer userId);

    // Find resource by file URL
    @Query("select r from Resource r where r.fileUrl = :fileUrl")
    java.util.Optional<Resource> findByFileUrl(@Param("fileUrl") String fileUrl);
}