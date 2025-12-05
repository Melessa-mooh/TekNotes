package com.appdevg4.bcd.teknotes.controller;

import com.appdevg4.bcd.teknotes.dto.ReviewRequest;
import com.appdevg4.bcd.teknotes.entity.Review;
import com.appdevg4.bcd.teknotes.service.ReviewService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class ReviewController {

    private final ReviewService service;

    public ReviewController(ReviewService service) {
        this.service = service;
    }

    
    @PostMapping
    public Review create(@RequestBody ReviewRequest request) {
        return service.create(request);
    }

    @GetMapping
    public List<Review> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public Review getById(@PathVariable Integer id) {
        return service.findById(id);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        service.delete(id);
    }

    @GetMapping("/user/{userId}")
    public List<Review> getUserReviews(@PathVariable Integer userId) {
        return service.findByUserId(userId);
    }

    @GetMapping("/resource/{resourceId}")
    public List<Review> getResourceReviews(@PathVariable Integer resourceId) {
        return service.findByResourceId(resourceId);
    }
}