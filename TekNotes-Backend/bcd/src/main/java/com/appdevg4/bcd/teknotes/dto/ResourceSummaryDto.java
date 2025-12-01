package com.appdevg4.bcd.teknotes.dto;

import com.appdevg4.bcd.teknotes.entity.Resource;
import lombok.Getter;
import lombok.Setter;

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
        dto.rating = 0.0;
        dto.reviews = 0;
        dto.downloads = 0;
        return dto;
    }
}