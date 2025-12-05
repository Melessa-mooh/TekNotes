package com.appdevg4.bcd.teknotes.dto;

import com.appdevg4.bcd.teknotes.entity.ReviewLike;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter @Setter
public class LikeDto {
    private Integer id;
    private Integer reviewId;
    private Integer userId;
    private LocalDateTime createdAt;
    private String status;

    public static LikeDto from(ReviewLike like) {
        LikeDto dto = new LikeDto();
        dto.id = like.getLikeId();
        dto.reviewId = like.getReview().getReviewId();
        dto.userId = like.getUser().getUserId();
        dto.createdAt = like.getCreatedAt();
        dto.status = like.getStatus();
        return dto;
    }
}

