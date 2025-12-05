package com.appdevg4.bcd.teknotes.dto;

import com.appdevg4.bcd.teknotes.entity.ReviewComment;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter @Setter
public class CommentDto {
    private Integer id;
    private Integer reviewId;
    private Integer userId;
    private String userName;
    private String comment;
    private LocalDateTime createdAt;

    public static CommentDto from(ReviewComment comment) {
        CommentDto dto = new CommentDto();
        dto.id = comment.getCommentId();
        dto.reviewId = comment.getReview().getReviewId();
        dto.userId = comment.getUser().getUserId();
        dto.userName = comment.getUser().getFirstName() + " " + comment.getUser().getLastName();
        dto.comment = comment.getComment();
        dto.createdAt = comment.getCreatedAt();
        return dto;
    }
}

