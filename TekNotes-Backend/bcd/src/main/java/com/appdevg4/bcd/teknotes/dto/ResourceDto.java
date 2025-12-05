package com.appdevg4.bcd.teknotes.dto;

import com.appdevg4.bcd.teknotes.entity.Resource;
import lombok.Data;

@Data
public class ResourceDto {

    private Integer id;
    private String title;
    private String fileUrl;
    private String tagName;
    private String tagDescription;

    private String courseName;
    private String courseCode;
    private String teacherName;
    private String department;

    private String uploadedBy; // "First Last"
    private Integer uploaderId;
    private String fileType; // PDF / PPTX / etc.
    private String createdAt; // ISO string

    // New fields for reviews and bookmarks
    private Double averageRating;
    private Integer reviewCount;
    private Integer downloadCount;
    private Boolean isBookmarked;

    public static ResourceDto from(Resource r) {
        ResourceDto dto = new ResourceDto();

        dto.id = r.getResourceId();
        dto.title = r.getTitle();
        dto.fileUrl = r.getFileUrl();
        dto.tagName = r.getTagName();
        dto.tagDescription = r.getTagDescription();

        // course info
        if (r.getCourse() != null) {
            dto.courseName = r.getCourse().getCourseName();
            dto.courseCode = r.getCourse().getCourseCode();
            dto.teacherName = r.getCourse().getTeacherName();
            dto.department = r.getCourse().getDepartment();
        }

        // uploader info
        if (r.getUploader() != null) {
            dto.uploadedBy = r.getUploader().getFirstName() + " " +
                    r.getUploader().getLastName();
        }

        // file type from extension
        if (r.getFileUrl() != null && r.getFileUrl().contains(".")) {
            String ext = r.getFileUrl()
                    .substring(r.getFileUrl().lastIndexOf('.') + 1)
                    .toUpperCase();
            dto.fileType = ext;
        } else {
            dto.fileType = "FILE";
        }

        dto.createdAt = r.getCreatedAt() != null
                ? r.getCreatedAt().toString()
                : null;

        // Calculate average rating from reviews
        if (r.getReviews() != null && !r.getReviews().isEmpty()) {
            dto.reviewCount = r.getReviews().size();
            double avgRating = r.getReviews().stream()
                    .filter(review -> review.getRating() != null)
                    .mapToInt(review -> review.getRating())
                    .average()
                    .orElse(0.0);
            dto.averageRating = Math.round(avgRating * 10.0) / 10.0;
        } else {
            dto.reviewCount = 0;
            dto.averageRating = 0.0;
        }

        // Set download count (default to 0 for now)
        dto.downloadCount = 0;
        dto.isBookmarked = false;

        // Get uploader ID
        if (r.getUploader() != null) {
            dto.uploaderId = r.getUploader().getUserId();
        }

        return dto;
    }
}