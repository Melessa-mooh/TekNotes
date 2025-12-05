package com.appdevg4.bcd.teknotes.service;

import com.appdevg4.bcd.teknotes.entity.Review;
import com.appdevg4.bcd.teknotes.entity.ReviewComment;
import com.appdevg4.bcd.teknotes.entity.User;
import com.appdevg4.bcd.teknotes.repository.ReviewCommentRepository;
import com.appdevg4.bcd.teknotes.repository.ReviewRepository;
import com.appdevg4.bcd.teknotes.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewCommentService {

    private final ReviewCommentRepository commentRepo;
    private final ReviewRepository reviewRepo;
    private final UserRepository userRepo;

    public ReviewCommentService(ReviewCommentRepository commentRepo,
                                ReviewRepository reviewRepo,
                                UserRepository userRepo) {
        this.commentRepo = commentRepo;
        this.reviewRepo = reviewRepo;
        this.userRepo = userRepo;
    }

    public ReviewComment createComment(Integer reviewId, Integer userId, String comment) {
        try {
            Review review = reviewRepo.findById(reviewId)
                    .orElseThrow(() -> new RuntimeException("Review not found: " + reviewId));
            User user = userRepo.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found: " + userId));

            ReviewComment reviewComment = new ReviewComment();
            reviewComment.setReview(review);
            reviewComment.setUser(user);
            reviewComment.setComment(comment);
            return commentRepo.save(reviewComment);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error creating comment: " + e.getMessage(), e);
        }
    }

    public List<ReviewComment> getCommentsByReviewId(Integer reviewId) {
        try {
            return commentRepo.findByReviewId(reviewId);
        } catch (Exception e) {
            e.printStackTrace();
            return new java.util.ArrayList<>(); // Return empty list on error
        }
    }

    public void deleteComment(Integer commentId) {
        ReviewComment comment = commentRepo.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found: " + commentId));
        comment.setStatus("DELETED");
        commentRepo.save(comment);
    }

    public long getCommentCount(Integer reviewId) {
        return commentRepo.countByReviewId(reviewId);
    }
}

