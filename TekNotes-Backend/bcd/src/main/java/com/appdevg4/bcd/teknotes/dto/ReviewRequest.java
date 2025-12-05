package com.appdevg4.bcd.teknotes.dto;

import lombok.Data;

@Data
public class ReviewRequest {
    private Integer userId;
    private Integer resourceId;
    private Integer rating;
    private String comment;
}
//dto