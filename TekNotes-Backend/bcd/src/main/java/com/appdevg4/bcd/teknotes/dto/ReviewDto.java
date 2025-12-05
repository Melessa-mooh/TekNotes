package com.appdevg4.bcd.teknotes.dto;

import com.appdevg4.bcd.teknotes.entity.Review;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter @Setter
public class ReviewDto {
    private Integer id;
    private Integer userId;
    private String userName;
    private Integer resourceId;
    private String resourceTitle;
    private String comment;
    private Integer rating;
    private LocalDateTime createdAt;
    private String status;
    private Long likeCount;
    private Long commentCount;
    private Boolean isLiked;

    public static ReviewDto from(Review review) {
        ReviewDto dto = new ReviewDto();
        dto.id = review.getReviewId();
        dto.userId = review.getUser().getUserId();
        dto.userName = review.getUser().getFirstName() + " " + review.getUser().getLastName();
        dto.resourceId = review.getResource().getResourceId();
        dto.resourceTitle = review.getResource().getTitle();
        dto.comment = review.getComment();
        dto.rating = review.getRating();
        dto.createdAt = review.getCreatedAt();
        dto.status = review.getStatus();
        return dto;
    }
}

