package com.appdevg4.bcd.teknotes.service;

import com.appdevg4.bcd.teknotes.dto.ReviewRequest;
import com.appdevg4.bcd.teknotes.entity.Resource;
import com.appdevg4.bcd.teknotes.entity.Review;
import com.appdevg4.bcd.teknotes.entity.User;
import com.appdevg4.bcd.teknotes.repository.ResourceRepository;
import com.appdevg4.bcd.teknotes.repository.ReviewRepository;
import com.appdevg4.bcd.teknotes.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final ResourceRepository resourceRepository;

    // Constructor Injection
    public ReviewService(ReviewRepository reviewRepository, 
                         UserRepository userRepository, 
                         ResourceRepository resourceRepository) {
        this.reviewRepository = reviewRepository;
        this.userRepository = userRepository;
        this.resourceRepository = resourceRepository;
    }

    public Review create(ReviewRequest request) {
       
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + request.getUserId()));

       
        Integer resourceId = request.getResourceId().intValue();

        Resource resource = resourceRepository.findById(resourceId)
                .orElseThrow(() -> new RuntimeException("Resource not found with ID: " + request.getResourceId()));

      
        Review review = new Review();
        review.setUser(user);
        review.setResource(resource);
        review.setRating(request.getRating());
        review.setComment(request.getComment());
        review.setCreatedAt(LocalDateTime.now());

     
        return reviewRepository.save(review);
    }

    public List<Review> findAll() {
        return reviewRepository.findAll();
    }

    public Review findById(Integer id) {
        return reviewRepository.findById(id).orElse(null);
    }

    public List<Review> findByUserId(Integer userId) {
        return reviewRepository.findByUser_UserId(userId);
    }
    
    public List<Review> findByResourceId(Integer resourceId) {
        return reviewRepository.findByResource_ResourceId(resourceId);
    }

    public Review update(Integer id, Review updatedReview) {
        return reviewRepository.findById(id)
            .map(review -> {
                review.setRating(updatedReview.getRating());
                review.setComment(updatedReview.getComment());
                return reviewRepository.save(review);
            })
            .orElseGet(() -> {
                updatedReview.setReviewId(id);
                return reviewRepository.save(updatedReview);
            });
    }

    public void delete(Integer id) {
        reviewRepository.deleteById(id);
    }
}