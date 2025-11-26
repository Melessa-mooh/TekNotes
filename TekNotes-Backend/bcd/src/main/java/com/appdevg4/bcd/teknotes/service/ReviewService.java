package com.appdevg4.bcd.teknotes.service;

import com.appdevg4.bcd.teknotes.entity.Review;
import com.appdevg4.bcd.teknotes.repository.ReviewRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewService {

    private final ReviewRepository repo;

    public ReviewService(ReviewRepository repo) {
        this.repo = repo;
    }

    public Review create(Review review) {
        return repo.save(review);
    }

    public List<Review> findAll() {
        return repo.findAll();
    }

    public Review findById(Integer id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Review not found: " + id));
    }

    public Review update(Integer id, Review updated) {
        Review r = findById(id);
        r.setUser(updated.getUser());
        r.setResource(updated.getResource());
        r.setComment(updated.getComment());
        r.setCreatedAt(updated.getCreatedAt());
        return repo.save(r);
    }

    public void delete(Integer id) {
        repo.deleteById(id);
    }
}
