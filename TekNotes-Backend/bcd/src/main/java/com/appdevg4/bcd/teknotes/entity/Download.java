package com.appdevg4.bcd.teknotes.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "downloads")
public class Download {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer downloadId;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(optional = false)
    @JoinColumn(name = "resource_id")
    private Resource resource;

    @Column(nullable = false)
    private LocalDateTime downloadDate;

    @Column(length = 20)
    private String status; // "ACTIVE" or "DELETED"

    public Download() {
        this.downloadDate = LocalDateTime.now();
        this.status = "ACTIVE";
    }

    public Integer getDownloadId() {
        return downloadId;
    }
    public void setDownloadId(Integer downloadId) {
        this.downloadId = downloadId;
    }
    public User getUser() {
        return user;
    }
    public void setUser(User user) {
        this.user = user;
    }
    public Resource getResource() {
        return resource;
    }
    public void setResource(Resource resource) {
        this.resource = resource;
    }
    public LocalDateTime getDownloadDate() {
        return downloadDate;
    }
    public void setDownloadDate(LocalDateTime downloadDate) {
        this.downloadDate = downloadDate;
    }
    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }
}

