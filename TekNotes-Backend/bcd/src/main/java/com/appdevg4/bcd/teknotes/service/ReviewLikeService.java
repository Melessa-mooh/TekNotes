package com.appdevg4.bcd.teknotes.service;

import com.appdevg4.bcd.teknotes.entity.Review;
import com.appdevg4.bcd.teknotes.entity.ReviewLike;
import com.appdevg4.bcd.teknotes.entity.User;
import com.appdevg4.bcd.teknotes.repository.ReviewLikeRepository;
import com.appdevg4.bcd.teknotes.repository.ReviewRepository;
import com.appdevg4.bcd.teknotes.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ReviewLikeService {

    private final ReviewLikeRepository likeRepo;
    private final ReviewRepository reviewRepo;
    private final UserRepository userRepo;

    public ReviewLikeService(ReviewLikeRepository likeRepo,
                            ReviewRepository reviewRepo,
                            UserRepository userRepo) {
        this.likeRepo = likeRepo;
        this.reviewRepo = reviewRepo;
        this.userRepo = userRepo;
    }

    public ReviewLike toggleLike(Integer reviewId, Integer userId) {
        try {
            Review review = reviewRepo.findById(reviewId)
                    .orElseThrow(() -> new RuntimeException("Review not found: " + reviewId));
            User user = userRepo.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found: " + userId));

            Optional<ReviewLike> existing = likeRepo.findByReviewIdAndUserId(reviewId, userId);

        if (existing.isPresent()) {
            ReviewLike like = existing.get();
            if (like.getStatus() == null || !like.getStatus().equals("DELETED")) {
                // Unlike - soft delete
                like.setStatus("DELETED");
                return likeRepo.save(like);
            } else {
                // Reactivate like
                like.setStatus("ACTIVE");
                return likeRepo.save(like);
            }
        } else {
            // Create new like
            ReviewLike like = new ReviewLike();
            like.setReview(review);
            like.setUser(user);
            return likeRepo.save(like);
        }
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error toggling like: " + e.getMessage(), e);
        }
    }

    public long getLikeCount(Integer reviewId) {
        return likeRepo.countByReviewId(reviewId);
    }

    public boolean isLikedByUser(Integer reviewId, Integer userId) {
        Optional<ReviewLike> like = likeRepo.findByReviewIdAndUserId(reviewId, userId);
        return like.isPresent() && (like.get().getStatus() == null || !like.get().getStatus().equals("DELETED"));
    }
}

