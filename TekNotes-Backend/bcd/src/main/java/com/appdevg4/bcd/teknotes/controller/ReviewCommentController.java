package com.appdevg4.bcd.teknotes.controller;

import com.appdevg4.bcd.teknotes.dto.CommentDto;
import com.appdevg4.bcd.teknotes.entity.ReviewComment;
import com.appdevg4.bcd.teknotes.service.ReviewCommentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reviews/comments")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class ReviewCommentController {

    private final ReviewCommentService service;

    public ReviewCommentController(ReviewCommentService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<CommentDto> createComment(@RequestBody CommentRequest request) {
        try {
            ReviewComment comment = service.createComment(
                request.getReviewId(),
                request.getUserId(),
                request.getComment()
            );
            return ResponseEntity.ok(CommentDto.from(comment));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(org.springframework.http.HttpStatus.BAD_REQUEST).build();
        }
    }

    @GetMapping("/review/{reviewId}")
    public ResponseEntity<List<CommentDto>> getCommentsByReview(@PathVariable Integer reviewId) {
        try {
            List<CommentDto> comments = service.getCommentsByReviewId(reviewId).stream()
                    .map(CommentDto::from)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(comments);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable Integer commentId) {
        try {
            service.deleteComment(commentId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @GetMapping("/count/{reviewId}")
    public ResponseEntity<Long> getCommentCount(@PathVariable Integer reviewId) {
        try {
            return ResponseEntity.ok(service.getCommentCount(reviewId));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok(0L);
        }
    }

    // Inner class for request
    public static class CommentRequest {
        private Integer reviewId;
        private Integer userId;
        private String comment;

        public Integer getReviewId() { return reviewId; }
        public void setReviewId(Integer reviewId) { this.reviewId = reviewId; }
        public Integer getUserId() { return userId; }
        public void setUserId(Integer userId) { this.userId = userId; }
        public String getComment() { return comment; }
        public void setComment(String comment) { this.comment = comment; }
    }
}

