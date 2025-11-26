package com.appdevg4.bcd.teknotes.controller;

import com.appdevg4.bcd.teknotes.entity.Review;
import com.appdevg4.bcd.teknotes.service.ReviewService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin
public class ReviewController {

    private final ReviewService service;

    public ReviewController(ReviewService service) {
        this.service = service;
    }

    @PostMapping
    public Review create(@RequestBody Review review) {
        return service.create(review);
    }

    @GetMapping
    public List<Review> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public Review getById(@PathVariable Integer id) {
        return service.findById(id);
    }

    @PutMapping("/{id}")
    public Review update(@PathVariable Integer id, @RequestBody Review review) {
        return service.update(id, review);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        service.delete(id);
    }
}
