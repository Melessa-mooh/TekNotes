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

    private String uploadedBy;   // "First Last"
    private String fileType;     // PDF / PPTX / etc.
    private String createdAt;    // ISO string

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
        }

        // uploader info
        if (r.getUploader() != null) {
            dto.uploadedBy =
                    r.getUploader().getFirstName() + " " +
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

        return dto;
    }
}