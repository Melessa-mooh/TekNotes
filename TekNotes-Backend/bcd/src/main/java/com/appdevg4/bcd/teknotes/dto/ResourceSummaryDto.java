package com.appdevg4.bcd.teknotes.dto;

import com.appdevg4.bcd.teknotes.entity.Resource;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter @Setter
public class ResourceSummaryDto {
    private Integer id;
    private String title;
    private String subject;      // course_name
    private String professor;    // teacher_name
    private String fileType;
    private String uploadTime;   // e.g. "2 hours ago"
    private double rating;       // placeholder if wala pa
    private int reviews;         // placeholder
    private int downloads;       // placeholder
    private Integer uploaderUserId;  // who uploaded this resource
    private String uploaderName;     // uploader's name
    private String description;      // resource description
    private String fileUrl;          // file URL for opening
    private String courseCode;       // course code for search
    private String department;      // department for search
    private String tags;            // tags for search

    public static ResourceSummaryDto from(Resource r) {
        ResourceSummaryDto dto = new ResourceSummaryDto();
        dto.id = r.getResourceId();
        dto.title = r.getTitle();
        dto.subject = r.getCourse().getCourseName();
        dto.professor = r.getCourse().getTeacherName();

        // Simple file type from fileUrl extension
        String url = r.getFileUrl();
        String ext = url != null && url.contains(".")
                ? url.substring(url.lastIndexOf(".") + 1).toUpperCase()
                : "FILE";
        dto.fileType = ext;

        dto.uploadTime = r.getCreatedAt().toString(); // later you can prettify in frontend
        
        // Calculate actual review count and average rating
        if (r.getReviews() != null && !r.getReviews().isEmpty()) {
            List<com.appdevg4.bcd.teknotes.entity.Review> activeReviews = r.getReviews().stream()
                    .filter(review -> review.getStatus() == null || !review.getStatus().equals("DELETED"))
                    .collect(java.util.stream.Collectors.toList());
            
            dto.reviews = activeReviews.size();
            if (dto.reviews > 0) {
                double avgRating = activeReviews.stream()
                        .filter(review -> review.getRating() != null)
                        .mapToInt(com.appdevg4.bcd.teknotes.entity.Review::getRating)
                        .average()
                        .orElse(0.0);
                dto.rating = Math.round(avgRating * 10.0) / 10.0;
            } else {
                dto.rating = 0.0;
            }
        } else {
            dto.reviews = 0;
            dto.rating = 0.0;
        }
        
        // Calculate actual download count
        if (r.getDownloads() != null && !r.getDownloads().isEmpty()) {
            dto.downloads = (int) r.getDownloads().stream()
                    .filter(download -> download.getStatus() == null || !download.getStatus().equals("DELETED"))
                    .count();
        } else {
            dto.downloads = 0;
        }
        
        // Add uploader information
        if (r.getUploader() != null) {
            dto.uploaderUserId = r.getUploader().getUserId();
            dto.uploaderName = r.getUploader().getFirstName() + " " + r.getUploader().getLastName();
        }
        
        // Add description and file URL
        dto.description = r.getTagDescription();
        dto.fileUrl = r.getFileUrl();
        
        // Add searchable fields
        if (r.getCourse() != null) {
            dto.courseCode = r.getCourse().getCourseCode();
            dto.department = r.getCourse().getDepartment();
        }
        dto.tags = r.getTagName();
        
        return dto;
    }
}