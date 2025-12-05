package com.appdevg4.bcd.teknotes.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "review_likes")
public class ReviewLike {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer likeId;

    @ManyToOne(optional = false)
    @JoinColumn(name = "review_id")
    @JsonIgnoreProperties({"likes", "comments", "hibernateLazyInitializer", "handler"})
    private Review review;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id")
    @JsonIgnoreProperties({"likes", "comments", "password", "hibernateLazyInitializer", "handler"})
    private User user;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(length = 20)
    private String status; // "ACTIVE" or "DELETED"

    public ReviewLike() {
        this.createdAt = LocalDateTime.now();
        this.status = "ACTIVE";
    }

    public Integer getLikeId() { return likeId; }
    public void setLikeId(Integer likeId) { this.likeId = likeId; }
    public Review getReview() { return review; }
    public void setReview(Review review) { this.review = review; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}

