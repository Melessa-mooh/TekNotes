package com.appdevg4.bcd.teknotes.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties; // <--- ADD THIS IMPORT
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reviews")
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer reviewId;

    
    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id")
    @JsonIgnoreProperties({"bookmarks", "reviews", "password", "hibernateLazyInitializer", "handler"}) 
    private User user;

   
    @ManyToOne(optional = false)
    @JoinColumn(name = "resource_id")
    @JsonIgnoreProperties({"reviews", "bookmarks", "hibernateLazyInitializer", "handler"}) 
    private Resource resource;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String comment;

    @Column(nullable = false)
    private Integer rating;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(length = 20)
    private String status; // "ACTIVE" or "DELETED"


    public Review() {
        this.createdAt = LocalDateTime.now();
        this.status = "ACTIVE";
    }
    
    public Integer getReviewId() { return reviewId; }
    public void setReviewId(Integer reviewId) { this.reviewId = reviewId; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public Resource getResource() { return resource; }
    public void setResource(Resource resource) { this.resource = resource; }
    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }
    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}