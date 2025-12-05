package com.appdevg4.bcd.teknotes.controller;

import com.appdevg4.bcd.teknotes.dto.LikeDto;
import com.appdevg4.bcd.teknotes.service.ReviewLikeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reviews/likes")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class ReviewLikeController {

    private final ReviewLikeService service;

    public ReviewLikeController(ReviewLikeService service) {
        this.service = service;
    }

    @PostMapping("/toggle/{reviewId}/{userId}")
    public ResponseEntity<LikeDto> toggleLike(@PathVariable Integer reviewId, @PathVariable Integer userId) {
        try {
            return ResponseEntity.ok(LikeDto.from(service.toggleLike(reviewId, userId)));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @GetMapping("/count/{reviewId}")
    public ResponseEntity<Long> getLikeCount(@PathVariable Integer reviewId) {
        try {
            return ResponseEntity.ok(service.getLikeCount(reviewId));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok(0L);
        }
    }

    @GetMapping("/check/{reviewId}/{userId}")
    public ResponseEntity<Boolean> isLiked(@PathVariable Integer reviewId, @PathVariable Integer userId) {
        try {
            return ResponseEntity.ok(service.isLikedByUser(reviewId, userId));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok(false);
        }
    }
}

