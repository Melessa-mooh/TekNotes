package com.appdevg4.bcd.teknotes.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "resources")
public class Resource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer resourceId;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id")
    private User uploader;

    @ManyToOne(optional = false)
    @JoinColumn(name = "course_id")
    private Course course;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(nullable = false, length = 500)
    private String fileUrl;

    @Column(length = 100)
    private String tagName;

    @Column(columnDefinition = "TEXT")
    private String tagDescription;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    public Resource() {
        this.createdAt = LocalDateTime.now();
    }

    public Integer getResourceId() {
        return resourceId;
    }
    public void setResourceId(Integer resourceId) {
        this.resourceId = resourceId;
    }
    public User getUploader() {
        return uploader;
    }
    public void setUploader(User uploader) {
        this.uploader = uploader;
    }
    public Course getCourse() {
        return course;
    }
    public void setCourse(Course course) {
        this.course = course;
    }
    public String getTitle() {
        return title;
    }
    public void setTitle(String title) {
        this.title = title;
    }
    public String getFileUrl() {
        return fileUrl;
    }
    public void setFileUrl(String fileUrl) {
        this.fileUrl = fileUrl;
    }
    public String getTagName() {
        return tagName;
    }
    public void setTagName(String tagName) {
        this.tagName = tagName;
    }
    public String getTagDescription() {
        return tagDescription;
    }
    public void setTagDescription(String tagDescription) {
        this.tagDescription = tagDescription;
    }
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
