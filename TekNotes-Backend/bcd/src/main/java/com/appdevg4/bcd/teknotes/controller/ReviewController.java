package com.appdevg4.bcd.teknotes.controller;

import com.appdevg4.bcd.teknotes.dto.ReviewDto;
import com.appdevg4.bcd.teknotes.dto.ReviewRequest;
import com.appdevg4.bcd.teknotes.entity.Review;
import com.appdevg4.bcd.teknotes.service.ReviewService;
import com.appdevg4.bcd.teknotes.service.ReviewLikeService;
import com.appdevg4.bcd.teknotes.service.ReviewCommentService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class ReviewController {

    private final ReviewService service;
    private final ReviewLikeService likeService;
    private final ReviewCommentService commentService;

    public ReviewController(ReviewService service, 
                           ReviewLikeService likeService,
                           ReviewCommentService commentService) {
        this.service = service;
        this.likeService = likeService;
        this.commentService = commentService;
    }

    
    @PostMapping
    public ReviewDto create(@RequestBody ReviewRequest request) {
        Review review = service.create(request);
        return ReviewDto.from(review);
    }

    @GetMapping
    public List<ReviewDto> getAll(@RequestParam(required = false) Integer userId) {
        return service.findAll().stream()
                .map(review -> {
                    ReviewDto dto = ReviewDto.from(review);
                    dto.setLikeCount(likeService.getLikeCount(review.getReviewId()));
                    dto.setCommentCount(commentService.getCommentCount(review.getReviewId()));
                    if (userId != null) {
                        dto.setIsLiked(likeService.isLikedByUser(review.getReviewId(), userId));
                    }
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ReviewDto getById(@PathVariable Integer id, @RequestParam(required = false) Integer userId) {
        Review review = service.findById(id);
        if (review == null) {
            throw new RuntimeException("Review not found: " + id);
        }
        ReviewDto dto = ReviewDto.from(review);
        dto.setLikeCount(likeService.getLikeCount(id));
        dto.setCommentCount(commentService.getCommentCount(id));
        if (userId != null) {
            dto.setIsLiked(likeService.isLikedByUser(id, userId));
        }
        return dto;
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        service.delete(id);
    }

    @GetMapping("/user/{userId}")
    public List<ReviewDto> getUserReviews(@PathVariable Integer userId) {
        return service.findByUserId(userId).stream()
                .map(review -> {
                    ReviewDto dto = ReviewDto.from(review);
                    dto.setLikeCount(likeService.getLikeCount(review.getReviewId()));
                    dto.setCommentCount(commentService.getCommentCount(review.getReviewId()));
                    dto.setIsLiked(likeService.isLikedByUser(review.getReviewId(), userId));
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @GetMapping("/resource/{resourceId}")
    public List<ReviewDto> getResourceReviews(@PathVariable Integer resourceId, @RequestParam(required = false) Integer userId) {
        return service.findByResourceId(resourceId).stream()
                .map(review -> {
                    ReviewDto dto = ReviewDto.from(review);
                    dto.setLikeCount(likeService.getLikeCount(review.getReviewId()));
                    dto.setCommentCount(commentService.getCommentCount(review.getReviewId()));
                    if (userId != null) {
                        dto.setIsLiked(likeService.isLikedByUser(review.getReviewId(), userId));
                    }
                    return dto;
                })
                .collect(Collectors.toList());
    }
}