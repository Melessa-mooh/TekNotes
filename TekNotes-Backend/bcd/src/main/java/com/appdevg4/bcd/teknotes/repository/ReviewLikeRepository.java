package com.appdevg4.bcd.teknotes.repository;

import com.appdevg4.bcd.teknotes.entity.ReviewLike;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ReviewLikeRepository extends JpaRepository<ReviewLike, Integer> {
    
    @Query("SELECT l FROM ReviewLike l WHERE l.review.reviewId = :reviewId AND (l.status IS NULL OR l.status != 'DELETED')")
    List<ReviewLike> findByReviewId(@Param("reviewId") Integer reviewId);
    
    @Query("SELECT l FROM ReviewLike l WHERE l.review.reviewId = :reviewId AND l.user.userId = :userId AND (l.status IS NULL OR l.status != 'DELETED')")
    Optional<ReviewLike> findByReviewIdAndUserId(@Param("reviewId") Integer reviewId, @Param("userId") Integer userId);
    
    @Query("SELECT COUNT(l) FROM ReviewLike l WHERE l.review.reviewId = :reviewId AND (l.status IS NULL OR l.status != 'DELETED')")
    long countByReviewId(@Param("reviewId") Integer reviewId);
}

