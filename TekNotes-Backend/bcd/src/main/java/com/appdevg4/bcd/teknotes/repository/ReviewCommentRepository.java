package com.appdevg4.bcd.teknotes.repository;

import com.appdevg4.bcd.teknotes.entity.ReviewComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReviewCommentRepository extends JpaRepository<ReviewComment, Integer> {
    
    @Query("SELECT c FROM ReviewComment c WHERE c.review.reviewId = :reviewId AND (c.status IS NULL OR c.status != 'DELETED') ORDER BY c.createdAt ASC")
    List<ReviewComment> findByReviewId(@Param("reviewId") Integer reviewId);
    
    @Query("SELECT COUNT(c) FROM ReviewComment c WHERE c.review.reviewId = :reviewId AND (c.status IS NULL OR c.status != 'DELETED')")
    long countByReviewId(@Param("reviewId") Integer reviewId);
}

